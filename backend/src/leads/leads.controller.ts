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
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';

import { AdminAuthGuard } from '../common/guards/admin-auth.guard';
import { CreateLeadDto } from './dto/create-lead.dto';
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
  updateStage(@Param('id') id: string, @Body() dto: UpdateStageDto) {
    return this.leadsService.updateStage(id, dto.stage);
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.leadsService.findAll(
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Get('stats')
  @UseGuards(AdminAuthGuard)
  stats() {
    return this.leadsService.stats();
  }
}
