import { IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StatusCarga } from '../../domain/enums/status-carga.enum.js';

export class UpdateStatusCargaDto {
  @ApiProperty({
    description: 'Novo status da carga no fluxo operacional',
    enum: StatusCarga,
    example: StatusCarga.EM_MOVIMENTACAO,
  })
  @IsNotEmpty({ message: 'status é obrigatório.' })
  @IsEnum(StatusCarga, { message: 'status informado não é um status operacional válido.' })
  status: any;
}