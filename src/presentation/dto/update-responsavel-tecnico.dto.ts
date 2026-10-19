import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateResponsavelTecnicoDto {
  @ApiPropertyOptional({ description: 'Nome completo do responsável técnico', example: 'Dr. Roberto Santos' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ description: 'Registro profissional (CRQ/CREA)', example: 'CRQ-IV 04218900' })
  @IsOptional()
  @IsString()
  registroProfissional?: string;

  @ApiPropertyOptional({ description: 'CPF do profissional', example: '123.456.789-00' })
  @IsOptional()
  @IsString()
  cpf?: string;
}