import { ProdutoQuimico } from '../entities/produto-quimico.entity.js';

export interface IProdutoQuimicoRepository {
  salvar(produto: ProdutoQuimico): Promise<ProdutoQuimico>;
  buscarPorId(id: string): Promise<ProdutoQuimico | null>;
  buscarTodos(apenasAtivos?: boolean): Promise<ProdutoQuimico[]>;
  atualizar(produto: ProdutoQuimico): Promise<ProdutoQuimico>;
}

export const PRODUTO_QUIMICO_REPOSITORY = Symbol('IProdutoQuimicoRepository');
