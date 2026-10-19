import { Controller, Get, Post, Body, Put, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponsaveisTecnicosService } from '../../application/services/responsaveis-tecnicos.service.js';
import { CreateResponsavelTecnicoDto } from '../dto/create-responsavel-tecnico.dto.js';
import { UpdateResponsavelTecnicoDto } from '../dto/update-responsavel-tecnico.dto.js';

@ApiTags('Responsáveis Técnicos')
@Controller('responsaveis-tecnicos')
export class ResponsaveisTecnicosController {
  constructor(private readonly service: ResponsaveisTecnicosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastrar novo responsável técnico' })
  @ApiResponse({ status: 201, description: 'Responsável técnico cadastrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou campos obrigatórios ausentes.' })
  async create(@Body() dto: CreateResponsavelTecnicoDto) {
    const data = await this.service.create(dto);
    return { message: 'Responsável técnico cadastrado com sucesso.', data };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os responsáveis técnicos' })
  async findAll() {
    const data = await this.service.findAll();
    return { total: data.length, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar responsável técnico por ID' })
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(id);
    return { data };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar dados do responsável técnico' })
  async update(@Param('id') id: string, @Body() dto: UpdateResponsavelTecnicoDto) {
    const data = await this.service.update(id, dto);
    return { message: 'Responsável técnico atualizado com sucesso.', data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover responsável técnico' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Responsável técnico removido com sucesso.' };
  }
}