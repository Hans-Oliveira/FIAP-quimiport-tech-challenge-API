import { Inspecao } from '../entities/inspecao.entity.js';

export interface IInspecaoRepository {
  salvar(inspecao: Inspecao): Promise<Inspecao>;
  buscarPorId(id: string): Promise<Inspecao | null>;
  buscarPorCargaId(idCarga: string): Promise<Inspecao[]>;
  atualizar(inspecao: Inspecao): Promise<Inspecao>;
}

export const INSPECAO_REPOSITORY = Symbol('IInspecaoRepository');