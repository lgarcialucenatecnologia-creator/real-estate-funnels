import { Transform, Type } from 'class-transformer';
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
  @IsObject()
  @Type(() => Object)
  tracking?: Record<string, string>;
}
