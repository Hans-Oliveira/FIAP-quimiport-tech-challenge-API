import { Controller, Get, Post, Body, Patch, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DocumentosCargaService } from '../../application/services/documentos-carga.service.js';
import { CreateDocumentoCargaDto } from '../dto/create-documento-carga.dto.js';

@ApiTags('Documentação de Carga')
@Controller('documentos-carga')
export class DocumentosCargaController {
  constructor(private readonly service: DocumentosCargaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'CU04: Anexar e validar documentação da carga' })
  @ApiResponse({ status: 201, description: 'Documento registrado e verificado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou data expirada.' })
  async create(@Body() dto: CreateDocumentoCargaDto) {
    const data = await this.service.create(dto);
    return {
      message: data.statusValido
        ? 'Documento anexado e validado com sucesso.'
        : 'Documento anexado, porém com pendência de validação.',
      data,
    };
  }

  @Get('carga/:idCarga')
  @ApiOperation({ summary: 'Consultar todos os documentos anexados a uma carga' })
  async findByCargaId(@Param('idCarga') idCarga: string) {
    const data = await this.service.findByCargaId(idCarga);
    return { total: data.length, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar documento por ID' })
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(id);
    return { data };
  }

  @Patch(':id/validar')
  @ApiOperation({ summary: 'Revalidar documento contra data atual' })
  async validar(@Param('id') id: string) {
    const data = await this.service.validarDocumento(id);
    return { message: 'Documento revalidado com sucesso.', data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover documento da carga' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Documento removido com sucesso.' };
  }
}