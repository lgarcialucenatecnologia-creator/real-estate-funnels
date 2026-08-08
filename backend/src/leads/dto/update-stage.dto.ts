import { IsEnum, IsOptional, IsString } from 'class-validator';

import { LeadStage } from '../schemas/lead.schema';

export class UpdateStageDto {
  @IsEnum(LeadStage, {
    message: `stage debe ser uno de: ${Object.values(LeadStage).join(', ')}`,
  })
  stage: LeadStage;

  /** Compartido con el evento del pixel del navegador, para deduplicar en Meta. */
  @IsOptional()
  @IsString()
  eventId?: string;
}
