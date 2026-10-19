import { IsNotEmpty, IsString, IsUUID, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInspecaoDto {
  @ApiProperty({ description: 'ID da Carga Química inspecionada', example: 'd4e5f6a7-b8c9-0123-def1-234567890123' })
  @IsNotEmpty({ message: 'idCarga é obrigatório.' })
  @IsUUID('all', { message: 'idCarga deve ser um UUID válido.' })
  idCarga: string;

  @ApiProperty({ description: 'Status inicial da inspeção', example: 'CONCLUIDA' })
  @IsNotEmpty({ message: 'statusInspecao é obrigatório.' })
  @IsString()
  statusInspecao: string;

  @ApiProperty({ description: 'Resultado da inspeção (true = aprovada, false = reprovada)', example: true })
  @IsNotEmpty({ message: 'resultado é obrigatório.' })
  @IsBoolean()
  resultado: boolean;

  @ApiPropertyOptional({ description: 'Parecer técnico detalhado da avaliação', example: 'Embalagens intactas, lacres de segurança conferidos sem vazamento.' })
  @IsOptional()
  @IsString()
  parecerTecnico?: string;
}