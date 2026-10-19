import { IsString, IsOptional, IsBoolean, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ClasseRisco } from '../../domain/enums/classe-risco.enum.js';

export class UpdateProdutoQuimicoDto {
  @ApiPropertyOptional({
    description: 'Nome do produto químico',
    example: 'Ácido Sulfúrico',
  })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({
    description: 'Classe de risco do produto químico',
    example: 'Classe 8 - Substâncias Corrosivas',
    enum: ClasseRisco,
  })
  @IsOptional()
  @IsString()
  classeRisco?: string;

  @ApiPropertyOptional({
    description: 'Peso padrão por unidade de medida em kg ou litros (Regra R10)',
    example: 25.5,
  })
  @IsOptional()
  @IsNumber({}, { message: 'O peso por unidade deve ser um número válido.' })
  @Min(0.001, { message: 'O peso por unidade deve ser maior que zero.' })
  pesoUnidade?: number;

  @ApiPropertyOptional({
    description: 'Descrição detalhada do produto',
    example: 'Utilizado para processos industriais e laboratoriais',
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional({
    description: 'Número ONU (identificação internacional para transporte)',
    example: '1830',
  })
  @IsOptional()
  @IsString()
  numeroOnu?: string;

  @ApiPropertyOptional({
    description: 'Grupo de compatibilidade para armazenagem',
    example: 'Grupo B',
  })
  @IsOptional()
  @IsString()
  grupoCompatibilidade?: string;

  @ApiPropertyOptional({
    description: 'Status ativo do produto químico no sistema',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}