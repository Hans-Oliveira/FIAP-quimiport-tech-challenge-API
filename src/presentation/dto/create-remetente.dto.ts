import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRemetenteDto {
  @ApiProperty({ description: 'Razão Social da empresa cliente', example: 'PetroQuímica Brasil S.A.' })
  @IsNotEmpty({ message: 'Razão social é obrigatória.' })
  @IsString()
  razaoSocial: string;

  @ApiProperty({ description: 'CNPJ formatado ou apenas dígitos', example: '12.345.678/0001-90' })
  @IsNotEmpty({ message: 'CNPJ é obrigatório.' })
  @IsString()
  cnpj: string;

  @ApiProperty({ description: 'Telefone de contato com DDD', example: '(13) 3210-9900' })
  @IsNotEmpty({ message: 'Telefone é obrigatório.' })
  @IsString()
  telefone: string;
}