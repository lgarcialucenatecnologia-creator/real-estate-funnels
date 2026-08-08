import { createHash } from 'crypto';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const GRAPH_API_VERSION = 'v21.0';

export interface ConversionEventInput {
  eventName: string;
  /** Compartido con el evento del pixel del navegador, para que Meta deduplique. */
  eventId: string;
  email: string;
  phoneE164: string;
  /** `tracking.fbclid` del lead, si el clic vino de un anuncio de Meta. */
  fbclid?: string;
  ipAddress?: string;
  userAgent?: string;
  eventSourceUrl?: string;
}

const sha256 = (value: string) =>
  createHash('sha256').update(value).digest('hex');

@Injectable()
export class MetaConversionsService {
  private readonly logger = new Logger(MetaConversionsService.name);

  constructor(private readonly config: ConfigService) {}

  /**
   * Manda un evento a la Conversions API de Meta. Nunca lanza: un problema
   * con Meta no debe romper el flujo real del lead (unirse a WhatsApp, etc).
   */
  async sendEvent(input: ConversionEventInput): Promise<void> {
    const pixelId = this.config.get<string>('meta.pixelId');
    const accessToken = this.config.get<string>('meta.capiAccessToken');

    if (!pixelId || !accessToken) {
      this.logger.debug(
        `Meta CAPI no configurada; se omite el evento "${input.eventName}"`,
      );
      return;
    }

    const userData: Record<string, unknown> = {
      em: [sha256(input.email.trim().toLowerCase())],
      ph: [sha256(input.phoneE164.replace(/\D/g, ''))],
    };
    if (input.ipAddress) userData.client_ip_address = input.ipAddress;
    if (input.userAgent) userData.client_user_agent = input.userAgent;
    if (input.fbclid) {
      // Formato documentado por Meta: fb.<subdomain_index>.<creation_time_ms>.<fbclid>
      userData.fbc = `fb.1.${Date.now()}.${input.fbclid}`;
    }

    const payload = {
      data: [
        {
          event_name: input.eventName,
          event_id: input.eventId,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: input.eventSourceUrl,
          user_data: userData,
        },
      ],
    };

    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${accessToken}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // No se loguea el body completo: puede reflejar el access_token en errores de Meta.
        this.logger.warn(
          `Meta CAPI respondió ${response.status} para el evento "${input.eventName}"`,
        );
        return;
      }

      this.logger.log(`Evento "${input.eventName}" enviado a Meta CAPI`);
    } catch (error) {
      this.logger.warn(
        `No se pudo enviar el evento "${input.eventName}" a Meta CAPI: ${
          error instanceof Error ? error.message : 'error desconocido'
        }`,
      );
    }
  }
}
