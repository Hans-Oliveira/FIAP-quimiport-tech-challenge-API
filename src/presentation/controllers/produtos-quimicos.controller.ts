import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Put,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreateProdutoQuimicoDto } from '../dto/create-produto-quimico.dto.js';
import { UpdateProdutoQuimicoDto } from '../dto/update-produto-quimico.dto.js';
import { CreateProdutoQuimicoUseCase } from '../../application/use-cases/create-produto-quimico.use-case.js';
import { InativarProdutoQuimicoUseCase } from '../../application/use-cases/inativar-produto-quimico.use-case.js';
import { ReativarProdutoQuimicoUseCase } from '../../application/use-cases/reativar-produto-quimico.use-case.js';
import { FindProdutosQuimicosUseCase } from '../../application/use-cases/find-produtos-quimicos.use-case.js';
import { FindProdutoQuimicoByIdUseCase } from '../../application/use-cases/find-produto-quimico-by-id.use-case.js';
import { UpdateProdutoQuimicoUseCase } from '../../application/use-cases/update-produto-quimico.use-case.js';

@ApiTags('Produtos Químicos')
@Controller('produtos-quimicos')
export class ProdutosQuimicosController {
  constructor(
    private readonly createProdutoQuimicoUseCase: CreateProdutoQuimicoUseCase,
    private readonly inativarProdutoQuimicoUseCase: InativarProdutoQuimicoUseCase,
    private readonly reativarProdutoQuimicoUseCase: ReativarProdutoQuimicoUseCase,
    private readonly findProdutosQuimicosUseCase: FindProdutosQuimicosUseCase,
    private readonly findProdutoQuimicoByIdUseCase: FindProdutoQuimicoByIdUseCase,
    private readonly updateProdutoQuimicoUseCase: UpdateProdutoQuimicoUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'CU01: Cadastrar novo produto químico no catálogo' })
  @ApiResponse({ status: 201, description: 'Produto químico cadastrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou campos obrigatórios ausentes.' })
  async create(@Body() createDto: CreateProdutoQuimicoDto) {
    const produto = await this.createProdutoQuimicoUseCase.execute(createDto);
    return {
      message: 'Produto químico cadastrado com sucesso.',
      data: produto,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar produtos químicos cadastrados' })
  @ApiQuery({ name: 'apenasAtivos', required: false, type: Boolean, description: 'Filtrar somente produtos ativos' })
  @ApiResponse({ status: 200, description: 'Lista de produtos químicos recuperada com sucesso.' })
  async findAll(@Query('apenasAtivos') apenasAtivos?: string) {
    const filtrarApenasAtivos = apenasAtivos === undefined ? true : apenasAtivos === 'true';
    const produtos = await this.findProdutosQuimicosUseCase.execute(filtrarApenasAtivos);
    return {
      total: produtos.length,
      data: produtos,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar detalhes de um produto químico por ID' })
  @ApiResponse({ status: 200, description: 'Produto químico encontrado.' })
  @ApiResponse({ status: 404, description: 'Produto químico não encontrado.' })
  async findOne(@Param('id') id: string) {
    const produto = await this.findProdutoQuimicoByIdUseCase.execute(id);
    return {
      data: produto,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar dados de um produto químico' })
  @ApiResponse({ status: 200, description: 'Produto químico atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produto químico não encontrado.' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateProdutoQuimicoDto,
  ) {
    const produto = await this.updateProdutoQuimicoUseCase.execute(id, updateDto);
    return {
      message: 'Produto químico atualizado com sucesso.',
      data: produto,
    };
  }

  @Patch(':id/inativar')
  @ApiOperation({ summary: 'CU02: Inativar produto químico (impede o uso em novas cargas)' })
  @ApiResponse({ status: 200, description: 'Produto químico inativado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produto químico não encontrado.' })
  async inativar(@Param('id') id: string) {
    const produto = await this.inativarProdutoQuimicoUseCase.execute(id);
    return {
      message: 'Produto químico inativado com sucesso.',
      data: produto,
    };
  }

  @Patch(':id/reativar')
  @ApiOperation({ summary: 'Reativar produto químico inativo' })
  @ApiResponse({ status: 200, description: 'Produto químico reativado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produto químico não encontrado.' })
  async reativar(@Param('id') id: string) {
    const produto = await this.reativarProdutoQuimicoUseCase.execute(id);
    return {
      message: 'Produto químico reativado com sucesso.',
      data: produto,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remoção lógica (inativação) de produto químico' })
  @ApiResponse({ status: 200, description: 'Produto químico inativado via soft delete.' })
  async remove(@Param('id') id: string) {
    return this.inativar(id);
  }
}