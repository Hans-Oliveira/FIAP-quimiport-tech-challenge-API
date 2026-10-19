import { DocumentoCarga } from '../entities/documento-carga.entity.js';

export interface IDocumentoCargaRepository {
  salvar(documento: DocumentoCarga): Promise<DocumentoCarga>;
  buscarPorId(id: string): Promise<DocumentoCarga | null>;
  buscarPorCargaId(idCarga: string): Promise<DocumentoCarga[]>;
  atualizar(documento: DocumentoCarga): Promise<DocumentoCarga>;
  remover(id: string): Promise<void>;
}

export const DOCUMENTO_CARGA_REPOSITORY = Symbol('IDocumentoCargaRepository')