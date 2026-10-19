import { Injectable } from '@nestjs/common';
import { CreateProdutoQuimicoUseCase } from '../application/use-cases/create-produto-quimico.use-case.js';
import { FindProdutosQuimicosUseCase } from '../application/use-cases/find-produtos-quimicos.use-case.js';
import { FindProdutoQuimicoByIdUseCase } from '../application/use-cases/find-produto-quimico-by-id.use-case.js';
import { UpdateProdutoQuimicoUseCase } from '../application/use-cases/update-produto-quimico.use-case.js';
import { InativarProdutoQuimicoUseCase } from '../application/use-cases/inativar-produto-quimico.use-case.js';
import { ReativarProdutoQuimicoUseCase } from '../application/use-cases/reativar-produto-quimico.use-case.js';
import { CreateProdutoQuimicoDto } from '../presentation/dto/create-produto-quimico.dto.js';
import { UpdateProdutoQuimicoDto } from '../presentation/dto/update-produto-quimico.dto.js';

@Injectable()
export class ProdutosQuimicosService {
  constructor(
    private readonly createUseCase: CreateProdutoQuimicoUseCase,
    private readonly findUseCase: FindProdutosQuimicosUseCase,
    private readonly findByIdUseCase: FindProdutoQuimicoByIdUseCase,
    private readonly updateUseCase: UpdateProdutoQuimicoUseCase,
    private readonly inativarUseCase: InativarProdutoQuimicoUseCase,
    private readonly reativarUseCase: ReativarProdutoQuimicoUseCase,
  ) {}

  async create(dto: CreateProdutoQuimicoDto) {
    return this.createUseCase.execute(dto);
  }

  async findAll(apenasAtivos = true) {
    return this.findUseCase.execute(apenasAtivos);
  }

  async findOne(id: string) {
    return this.findByIdUseCase.execute(id);
  }

  async update(id: string, dto: UpdateProdutoQuimicoDto) {
    return this.updateUseCase.execute(id, dto);
  }

  async remove(id: string) {
    return this.inativar(id);
  }

  async inativar(id: string) {
    return this.inativarUseCase.execute(id);
  }

  async reativar(id: string) {
    return this.reativarUseCase.execute(id);
  }
}