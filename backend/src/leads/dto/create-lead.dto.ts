import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/**
 * Mismas claves que ya limita el frontend (TRACKING_KEYS en
 * src/lib/funnel-session.ts, más las cookies de src/lib/pixel.ts) — pero el
 * backend no debe confiar en eso: nada impide que alguien le pegue directo al
 * API con lo que quiera.
 */
const TRACKING_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
  'ttclid',
  // Cookies del pixel de Meta (`_fbp` y `_fbc`), que el navegador copia aquí
  // para que la Conversions API pueda emparejar los eventos server-side.
  'fbp',
  'fbc',
] as const;

/** Límite defensivo por valor para no guardar cadenas gigantes en Mongo. */
const MAX_TRACKING_VALUE_LENGTH = 512;

/** Descarta claves desconocidas y recorta valores muy largos. */
const sanitizeTracking = ({
  value,
}: {
  value: unknown;
}): Record<string, string> | undefined => {
  if (!value || typeof value !== 'object') return undefined;

  const source = value as Record<string, unknown>;
  const result: Record<string, string> = {};

  for (const key of TRACKING_KEYS) {
    const raw = source[key];
    if (typeof raw !== 'string') continue;
    const trimmed = raw.trim();
    if (!trimmed) continue;
    result[key] = trimmed.slice(0, MAX_TRACKING_VALUE_LENGTH);
  }

  return Object.keys(result).length > 0 ? result : undefined;
};

export class CreateLeadDto {
  @Transform(trim)
  @IsString()
  @Length(2, 80, { message: 'El nombre debe tener entre 2 y 80 caracteres' })
  firstName: string;

  @Transform(trim)
  @IsString()
  @Length(1, 80, { message: 'El apellido debe tener entre 1 y 80 caracteres' })
  lastName: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString()
  @Matches(/^[A-Z]{2}$/, { message: 'countryCode debe ser un ISO de 2 letras' })
  countryCode: string;

  @Transform(trim)
  @IsString()
  @Matches(/^\+\d{1,4}$/, { message: 'dialCode debe tener el formato +57' })
  dialCode: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.replace(/\D/g, '') : value,
  )
  @IsString()
  @Length(6, 15, { message: 'El número de celular no es válido' })
  phoneNumber: string;

  @IsOptional()
  @Transform(sanitizeTracking)
  @IsObject()
  tracking?: Record<string, string>;
}
