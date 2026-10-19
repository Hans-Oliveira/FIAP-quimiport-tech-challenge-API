import { Inject, Injectable } from '@nestjs/common';
import { ProdutoQuimico } from '../../domain/entities/produto-quimico.entity.js';
import type { IProdutoQuimicoRepository } from '../../domain/repositories/produto-quimico.repository.interface.js';
import { PRODUTO_QUIMICO_REPOSITORY } from '../../domain/repositories/produto-quimico.repository.interface.js';

@Injectable()
export class FindProdutosQuimicosUseCase {
  constructor(
    @Inject(PRODUTO_QUIMICO_REPOSITORY)
    private readonly produtoRepository: IProdutoQuimicoRepository,
  ) {}

  async execute(apenasAtivos = true): Promise<ProdutoQuimico[]> {
    return await this.produtoRepository.buscarTodos(apenasAtivos);
  }
}