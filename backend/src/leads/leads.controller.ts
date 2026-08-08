import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';

import { buildXlsxBuffer } from '../common/xlsx';
import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ExportXlsxDto } from './dto/export-xlsx.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { LeadsService } from './leads.service';

@Controller('leads')
export class LeadsController {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly config: ConfigService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async create(@Body() dto: CreateLeadDto, @Req() request: Request) {
    const lead = await this.leadsService.create(dto, {
      ipAddress: request.ip,
      userAgent: request.header('user-agent'),
    });

    return {
      lead,
      nextStep: {
        progressPercentage: this.config.get<number>(
          'funnel.progressPercentage',
        ),
        whatsappGroupUrl: this.config.get<string>('funnel.whatsappGroupUrl'),
      },
    };
  }

  @Patch(':id/stage')
  updateStage(
    @Param('id') id: string,
    @Body() dto: UpdateStageDto,
    @Req() request: Request,
  ) {
    return this.leadsService.updateStage(id, dto.stage, dto.eventId, {
      ipAddress: request.ip,
      userAgent: request.header('user-agent'),
    });
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('campaign') campaign?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.leadsService.findAll(
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      { campaign, dateFrom, dateTo },
    );
  }

  @Get('export')
  @UseGuards(AdminAuthGuard)
  async findAllForExport(
    @Query('campaign') campaign?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const items = await this.leadsService.findAllForExport({
      campaign,
      dateFrom,
      dateTo,
    });
    return { items };
  }

  @Get('campaigns')
  @UseGuards(AdminAuthGuard)
  async findCampaigns() {
    const items = await this.leadsService.findCampaigns();
    return { items };
  }

  @Get('stats')
  @UseGuards(AdminAuthGuard)
  stats() {
    return this.leadsService.stats();
  }

  /**
   * Armador de .xlsx genérico: recibe encabezados + filas ya formateadas por
   * el frontend (misma fuente que usa la tabla en pantalla) y solo construye
   * el archivo binario. No conoce nada sobre leads ni UTMs.
   */
  @Post('export/xlsx')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminAuthGuard)
  async exportXlsx(@Body() dto: ExportXlsxDto, @Res() res: Response) {
    const buffer = await buildXlsxBuffer(dto.columns, dto.rows);
    const filename = dto.filename ?? 'leads.xlsx';

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    res.send(buffer);
  }
}
