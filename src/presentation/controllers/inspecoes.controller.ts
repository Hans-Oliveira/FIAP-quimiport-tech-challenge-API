import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InspecoesService } from '../../application/services/inspecoes.service.js';
import { CreateInspecaoDto } from '../dto/create-inspecao.dto.js';

@ApiTags('Inspeções')
@Controller('inspecoes')
export class InspecoesController {
  constructor(private readonly service: InspecoesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar parecer e resultado de inspeção da carga' })
  @ApiResponse({ status: 201, description: 'Inspeção registrada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou campos obrigatórios ausentes.' })
  async create(@Body() dto: CreateInspecaoDto) {
    const data = await this.service.create(dto);
    return { message: 'Inspeção registrada com sucesso.', data };
  }

  @Get('carga/:idCarga')
  @ApiOperation({ summary: 'Consultar histórico de inspeções de uma carga' })
  async findByCargaId(@Param('idCarga') idCarga: string) {
    const data = await this.service.findByCargaId(idCarga);
    return { total: data.length, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar detalhes de uma inspeção por ID' })
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(id);
    return { data };
  }
}