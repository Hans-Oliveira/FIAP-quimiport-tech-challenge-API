import { CargaQuimica } from '../entities/carga-quimica.entity.js';

export interface FiltrosCarga {
  status?: string;
  idProduto?: string;
  codigoCarga?: string;
  idRemetente?: string;
  idResponsavelTecnico?: string;
}

export interface ICargaQuimicaRepository {
  salvar(carga: CargaQuimica): Promise<CargaQuimica>;
  buscarPorId(id: string): Promise<CargaQuimica | null>;
  buscarTodos(filtros?: FiltrosCarga): Promise<CargaQuimica[]>;
  atualizar(carga: CargaQuimica): Promise<CargaQuimica>;
}

export const CARGA_QUIMICA_REPOSITORY = Symbol('ICargaQuimicaRepository');