import { ResponsavelTecnico } from '../entities/responsavel-tecnico.entity.js';

export interface IResponsavelTecnicoRepository {
  salvar(responsavel: ResponsavelTecnico): Promise<ResponsavelTecnico>;
  buscarPorId(id: string): Promise<ResponsavelTecnico | null>;
  buscarTodos(): Promise<ResponsavelTecnico[]>;
  atualizar(responsavel: ResponsavelTecnico): Promise<ResponsavelTecnico>;
  remover(id: string): Promise<void>;
}

export const RESPONSAVEL_TECNICO_REPOSITORY = Symbol('IResponsavelTecnicoRepository');
