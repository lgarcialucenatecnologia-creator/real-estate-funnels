import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('funnel')
export class FunnelController {
  constructor(private readonly config: ConfigService) {}

  @Get('config')
  getConfig() {
    return {
      progressPercentage: this.config.get<number>('funnel.progressPercentage'),
      whatsappGroupUrl: this.config.get<string>('funnel.whatsappGroupUrl'),
    };
  }
}
