import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResponsavelTecnicoDto {
  @ApiProperty({ description: 'Nome completo do responsável técnico', example: 'Dr. Roberto Santos' })
  @IsNotEmpty({ message: 'Nome do responsável técnico é obrigatório.' })
  @IsString()
  nome: string;

  @ApiProperty({ description: 'Registro no conselho (CRQ ou CREA)', example: 'CRQ-IV 04218900' })
  @IsNotEmpty({ message: 'Registro profissional é obrigatório.' })
  @IsString()
  registroProfissional: string;

  @ApiProperty({ description: 'CPF do profissional', example: '123.456.789-00' })
  @IsNotEmpty({ message: 'CPF é obrigatório.' })
  @IsString()
  cpf: string;
}