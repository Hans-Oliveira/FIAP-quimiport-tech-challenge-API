import { IsNotEmpty, IsString, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentoCargaDto {
  @ApiProperty({ description: 'ID da Carga Química à qual o documento pertence', example: 'd4e5f6a7-b8c9-0123-def1-234567890123' })
  @IsNotEmpty({ message: 'idCarga é obrigatório.' })
  @IsUUID('all', { message: 'idCarga deve ser um UUID válido.' })
  idCarga: string;

  @ApiProperty({ description: 'Tipo do documento ou licença regulatória', example: 'Licença Ambiental de Transporte / FISPQ' })
  @IsNotEmpty({ message: 'tipoDocumento é obrigatório.' })
  @IsString()
  tipoDocumento: string;

  @ApiProperty({ description: 'Data de validade do documento (deve ser futura para aprovação)', example: '2028-12-31T23:59:59.000Z' })
  @IsNotEmpty({ message: 'dataValidade é obrigatória.' })
  @IsDateString({}, { message: 'dataValidade deve estar no formato ISO-8601 (ex: YYYY-MM-DD).' })
  dataValidade: string;
}