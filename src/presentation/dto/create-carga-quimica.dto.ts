import { IsNotEmpty, IsString, IsNumber, Min, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCargaQuimicaDto {
  @ApiProperty({ description: 'Código identificador da carga física', example: 'CRG-2026-001' })
  @IsNotEmpty({ message: 'Código da carga é obrigatório.' })
  @IsString()
  codigoCarga: string;

  @ApiProperty({ description: 'ID do Produto Químico de referência', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @IsNotEmpty({ message: 'Uma carga química não pode ser registrada sem produto químico associado.' })
  @IsUUID('all', { message: 'idProduto deve ser um UUID válido.' })
  idProduto: string;

  @ApiProperty({ description: 'Quantidade física da carga (maior que zero)', example: 1200.5 })
  @IsNotEmpty({ message: 'Quantidade da carga é obrigatória.' })
  @IsNumber({}, { message: 'Quantidade deve ser um valor numérico.' })
  @Min(0.001, { message: 'A quantidade da carga deve ser maior que zero.' })
  quantidade: number;

  @ApiProperty({ description: 'Unidade de medida', example: 'kg' })
  @IsNotEmpty({ message: 'Unidade de medida é obrigatória (ex: kg, L, ton).' })
  @IsString()
  unidadeMedida: string;

  @ApiProperty({ description: 'Local de origem da carga', example: 'Terminal Granéis Líquidos Santos' })
  @IsNotEmpty({ message: 'Origem é obrigatória.' })
  @IsString()
  origem: string;

  @ApiProperty({ description: 'Local de destino da carga', example: 'Pátio de Estocagem Químico 4' })
  @IsNotEmpty({ message: 'Destino é obrigatório.' })
  @IsString()
  destino: string;

  @ApiProperty({ description: 'Nome e registro do Responsável Técnico informado', example: 'Dr. Roberto Santos - CRQ 04218900' })
  @IsNotEmpty({ message: 'Toda carga deve possuir responsável técnico informado.' })
  @IsString()
  responsavelTecnico: string;

  @ApiPropertyOptional({ description: 'Indica se a documentação obrigatória já foi apresentada e validada', example: false })
  @IsOptional()
  @IsBoolean()
  documentacaoObrigatoria?: boolean;

  @ApiPropertyOptional({ description: 'ID da Empresa Remetente cadastrada (opcional)', example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' })
  @IsOptional()
  @IsUUID('all')
  idRemetente?: string;

  @ApiPropertyOptional({ description: 'ID do Responsável Técnico cadastrado (opcional)', example: 'c3d4e5f6-a7b8-9012-cdef-123456789012' })
  @IsOptional()
  @IsUUID('all')
  idResponsavelTecnico?: string;
}