import { Inject, Injectable } from '@nestjs/common';
import { ProdutoQuimico } from '../../domain/entities/produto-quimico.entity.js';
import type { IProdutoQuimicoRepository } from '../../domain/repositories/produto-quimico.repository.interface.js';
import { PRODUTO_QUIMICO_REPOSITORY } from '../../domain/repositories/produto-quimico.repository.interface.js';

export interface CreateProdutoQuimicoInput {
  nome: string;
  classeRisco: string;
  descricao?: string;
  pesoUnidade?: number;
  numeroOnu?: string;
  grupoCompatibilidade?: string;
}

@Injectable()
export class CreateProdutoQuimicoUseCase {
  constructor(
    @Inject(PRODUTO_QUIMICO_REPOSITORY)
    private readonly produtoRepository: IProdutoQuimicoRepository,
  ) {}

  async execute(input: CreateProdutoQuimicoInput): Promise<ProdutoQuimico> {
    const produto = new ProdutoQuimico({
      nome: input.nome,
      classeRisco: input.classeRisco,
      descricao: input.descricao,
      pesoUnidade: input.pesoUnidade,
      numeroOnu: input.numeroOnu,
      grupoCompatibilidade: input.grupoCompatibilidade,
    });

    return await this.produtoRepository.salvar(produto);
  }
}