import { IsEnum } from 'class-validator';

import { LeadStage } from '../schemas/lead.schema';

export class UpdateStageDto {
  @IsEnum(LeadStage, {
    message: `stage debe ser uno de: ${Object.values(LeadStage).join(', ')}`,
  })
  stage: LeadStage;
}
