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
  firstName?: string;
  lastName?: string;
  /** ISO de 2 letras, en minúsculas al hashear. */
  countryCode?: string;
  /** Cookie `_fbp` del pixel: identifica el navegador. */
  fbp?: string;
  /** Cookie `_fbc` del pixel: el clic del anuncio con su timestamp real. */
  fbc?: string;
  /** `tracking.fbclid` del lead; solo se usa si no llegó la cookie `_fbc`. */
  fbclid?: string;
  ipAddress?: string;
  userAgent?: string;
  eventSourceUrl?: string;
  /** Parámetros del evento (content_name, value, currency...). */
  customData?: Record<string, unknown>;
}

const sha256 = (value: string) =>
  createHash('sha256').update(value).digest('hex');

/** Meta exige minúsculas, sin espacios ni acentos antes de hashear. */
const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

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
      em: [sha256(normalize(input.email))],
      ph: [sha256(input.phoneE164.replace(/\D/g, ''))],
    };

    // Cada campo extra sube la calidad de emparejamiento que reporta Meta.
    if (input.firstName) userData.fn = [sha256(normalize(input.firstName))];
    if (input.lastName) userData.ln = [sha256(normalize(input.lastName))];
    if (input.countryCode) {
      userData.country = [sha256(normalize(input.countryCode))];
    }
    if (input.ipAddress) userData.client_ip_address = input.ipAddress;
    if (input.userAgent) userData.client_user_agent = input.userAgent;
    if (input.fbp) userData.fbp = input.fbp;

    if (input.fbc) {
      // La cookie ya viene con el formato y el timestamp real del clic.
      userData.fbc = input.fbc;
    } else if (input.fbclid) {
      /*
        Sin cookie hay que reconstruirla: fb.<subdomain_index>.<timestamp>.<fbclid>.
        El timestamp queda desfasado (es el del evento, no el del clic), así que
        esto es solo el respaldo cuando el navegador no mandó `_fbc`.
      */
      userData.fbc = `fb.1.${Date.now()}.${input.fbclid}`;
    }

    const payload = {
      data: [
        {
          event_name: input.eventName,
          event_id: input.eventId,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          ...(input.eventSourceUrl
            ? { event_source_url: input.eventSourceUrl }
            : {}),
          user_data: userData,
          ...(input.customData ? { custom_data: input.customData } : {}),
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
