import { Remetente } from '../entities/remetente.entity.js';

export interface IRemetenteRepository {
  salvar(remetente: Remetente): Promise<Remetente>;
  buscarPorId(id: string): Promise<Remetente | null>;
  buscarTodos(): Promise<Remetente[]>;
  atualizar(remetente: Remetente): Promise<Remetente>;
  remover(id: string): Promise<void>;
}

export const REMETENTE_REPOSITORY = Symbol('IRemetenteRepository');
