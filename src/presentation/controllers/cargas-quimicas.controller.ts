import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CargasQuimicasService } from '../../application/services/cargas-quimicas.service.js';
import { CreateCargaQuimicaDto } from '../dto/create-carga-quimica.dto.js';
import { UpdateStatusCargaDto } from '../dto/update-status-carga.dto.js';

@ApiTags('Cargas Químicas')
@Controller('cargas-quimicas')
export class CargasQuimicasController {
  constructor(private readonly service: CargasQuimicasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar nova carga química no porto' })
  @ApiResponse({ status: 201, description: 'Carga registrada com status inicial "Registrada".' })
  @ApiResponse({ status: 400, description: 'Produto inativo, quantidade inválida ou campos obrigatórios ausentes.' })
  async create(@Body() dto: CreateCargaQuimicaDto) {
    const data = await this.service.create(dto);
    return {
      message: 'Carga química registrada com sucesso. Status inicial: Registrada.',
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar cargas químicas com filtros' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por status atual' })
  @ApiQuery({ name: 'idProduto', required: false, description: 'Filtrar por produto químico' })
  @ApiQuery({ name: 'codigoCarga', required: false, description: 'Filtrar por código da carga' })
  async findAll(
    @Query('status') status?: string,
    @Query('idProduto') idProduto?: string,
    @Query('codigoCarga') codigoCarga?: string,
  ) {
    const data = await this.service.findAll({
      status,
      idProduto,
      codigoCarga,
    });
    return { total: data.length, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar carga química por identificador' })
  @ApiResponse({ status: 200, description: 'Carga encontrada.' })
  @ApiResponse({ status: 404, description: 'Carga química não encontrada.' })
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(id);
    return { data };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status da carga (aplica máquina de estados da Página 6 do PDF)' })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Transição de status proibida ou regras violadas.' })
  async atualizarStatus(@Param('id') id: string, @Body() dto: UpdateStatusCargaDto) {
    const data = await this.service.atualizarStatus(id, dto.status);
    return {
      message: `Status da carga atualizado com sucesso para "${dto.status}".`,
      data,
    };
  }

  @Patch(':id/bloquear')
  @ApiOperation({ summary: 'Bloquear carga química (interrompe operações e impede movimentação)' })
  @ApiResponse({ status: 200, description: 'Carga bloqueada com sucesso.' })
  async bloquear(@Param('id') id: string, @Body('motivo') motivo?: any) {
    const data = await this.service.bloquear(id, motivo);
    return {
      message: 'Carga química bloqueada com sucesso.',
      data,
    };
  }

  @Patch(':id/liberar')
  @ApiOperation({ summary: 'Liberar carga química (exige documentação obrigatória validada)' })
  @ApiResponse({ status: 200, description: 'Carga liberada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Carga sem documentação obrigatória ou com status incompatível.' })
  async liberar(@Param('id') id: string) {
    const data = await this.service.liberar(id);
    return {
      message: 'Carga química liberada com sucesso para movimentação.',
      data,
    };
  }

  @Patch(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar carga química (cargas já finalizadas não podem ser canceladas)' })
  @ApiResponse({ status: 200, description: 'Carga cancelada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Carga já finalizada ou em estado terminal.' })
  async cancelar(@Param('id') id: string) {
    const data = await this.service.cancelar(id);
    return {
      message: 'Carga química cancelada com sucesso.',
      data,
    };
  }

  @Patch(':id/documentacao')
  @ApiOperation({ summary: 'Apresentar e validar documentação obrigatória da carga' })
  @ApiResponse({ status: 200, description: 'Documentação validada com sucesso.' })
  async validarDocumentacao(@Param('id') id: string) {
    const data = await this.service.validarDocumentacao(id);
    return {
      message: 'Documentação obrigatória da carga apresentada e validada.',
      data,
    };
  }
}