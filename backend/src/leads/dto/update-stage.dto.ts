import { IsEnum, IsOptional, IsString, IsUrl, Length } from 'class-validator';

import { LeadStage } from '../schemas/lead.schema';

export class UpdateStageDto {
  @IsEnum(LeadStage, {
    message: `stage debe ser uno de: ${Object.values(LeadStage).join(', ')}`,
  })
  stage: LeadStage;

  /** Compartido con el evento del pixel del navegador, para deduplicar en Meta. */
  @IsOptional()
  @IsString()
  @Length(1, 128)
  eventId?: string;

  /**
   * URL de la página donde ocurrió el evento. Lo manda el navegador porque el
   * `Referer` de un fetch cross-origin llega recortado al origen por la
   * política por defecto de Next, y Meta quiere la ruta completa.
   */
  @IsOptional()
  // `require_tld: false` para que `http://localhost:3000/...` valide en dev.
  @IsUrl({ require_protocol: true, require_tld: false })
  @Length(1, 512)
  eventSourceUrl?: string;
}
