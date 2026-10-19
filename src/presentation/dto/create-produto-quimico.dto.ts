import { IsNotEmpty, IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClasseRisco } from '../../domain/enums/classe-risco.enum.js';

export class CreateProdutoQuimicoDto {
  @ApiProperty({
    description: 'Nome do produto químico',
    example: 'Ácido Sulfúrico',
  })
  @IsNotEmpty({ message: 'Um produto químico não pode ser cadastrado sem nome.' })
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'Classe de risco do produto químico',
    example: 'Classe 8 - Substâncias Corrosivas',
    enum: ClasseRisco,
  })
  @IsNotEmpty({ message: 'Um produto químico não pode ser cadastrado sem classe de risco.' })
  @IsString()
  classeRisco: string;

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
}