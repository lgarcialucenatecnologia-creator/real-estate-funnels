import { IsArray, IsOptional, IsString } from 'class-validator';

export class ExportXlsxDto {
  @IsArray()
  @IsString({ each: true })
  columns: string[];

  /** El endpoint es solo un armador de .xlsx genérico: no valida el contenido de cada fila. */
  @IsArray()
  rows: string[][];

  @IsOptional()
  @IsString()
  filename?: string;
}
