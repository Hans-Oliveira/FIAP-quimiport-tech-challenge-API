import { Inject, Injectable } from '@nestjs/common';
import { ProdutoQuimico } from '../../domain/entities/produto-quimico.entity.js';
import { EntityNotFoundError } from '../../domain/errors/business-rule.error.js';
import type { IProdutoQuimicoRepository } from '../../domain/repositories/produto-quimico.repository.interface.js';
import { PRODUTO_QUIMICO_REPOSITORY } from '../../domain/repositories/produto-quimico.repository.interface.js';

export interface UpdateProdutoQuimicoInput {
  nome?: string;
  classeRisco?: string;
  descricao?: string;
  pesoUnidade?: number;
  numeroOnu?: string;
  grupoCompatibilidade?: string;
  status?: boolean;
}

@Injectable()
export class UpdateProdutoQuimicoUseCase {
  constructor(
    @Inject(PRODUTO_QUIMICO_REPOSITORY)
    private readonly produtoRepository: IProdutoQuimicoRepository,
  ) {}

  async execute(id: string, input: UpdateProdutoQuimicoInput): Promise<ProdutoQuimico> {
    const produto = await this.produtoRepository.buscarPorId(id);

    if (!produto) {
      throw new EntityNotFoundError('Produto químico', id);
    }

    produto.atualizarDados(input);
    return await this.produtoRepository.atualizar(produto);
  }
}