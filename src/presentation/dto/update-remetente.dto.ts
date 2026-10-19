import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRemetenteDto {
  @ApiPropertyOptional({ description: 'Razão Social da empresa cliente', example: 'PetroQuímica Brasil S.A.' })
  @IsOptional()
  @IsString()
  razaoSocial?: string;

  @ApiPropertyOptional({ description: 'CNPJ do remetente', example: '12.345.678/0001-90' })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiPropertyOptional({ description: 'Telefone de contato', example: '(13) 3210-9900' })
  @IsOptional()
  @IsString()
  telefone?: string;
}