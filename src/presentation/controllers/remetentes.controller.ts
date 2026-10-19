import { Controller, Get, Post, Body, Put, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RemetentesService } from '../../application/services/remetentes.service.js';
import { CreateRemetenteDto } from '../dto/create-remetente.dto.js';
import { UpdateRemetenteDto } from '../dto/update-remetente.dto.js';

@ApiTags('Remetentes (Empresas Clientes)')
@Controller('remetentes')
export class RemetentesController {
  constructor(private readonly service: RemetentesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastrar nova empresa remetente' })
  @ApiResponse({ status: 201, description: 'Remetente cadastrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou campos obrigatórios ausentes.' })
  async create(@Body() dto: CreateRemetenteDto) {
    const data = await this.service.create(dto);
    return { message: 'Remetente cadastrado com sucesso.', data };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as empresas remetentes' })
  async findAll() {
    const data = await this.service.findAll();
    return { total: data.length, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar remetente por ID' })
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(id);
    return { data };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar dados do remetente' })
  async update(@Param('id') id: string, @Body() dto: UpdateRemetenteDto) {
    const data = await this.service.update(id, dto);
    return { message: 'Remetente atualizado com sucesso.', data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover remetente' })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { message: 'Remetente removido com sucesso.' };
  }
}