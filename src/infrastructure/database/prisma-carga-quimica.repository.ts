import { Injectable, Logger } from '@nestjs/common';
import {
  ICargaQuimicaRepository,
  FiltrosCarga,
} from '../../domain/repositories/carga-quimica.repository.interface.js';
import { CargaQuimica } from '../../domain/entities/carga-quimica.entity.js';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class PrismaCargaQuimicaRepository implements ICargaQuimicaRepository {
  private readonly logger = new Logger(PrismaCargaQuimicaRepository.name);
  private readonly memoryStore: Map<string, CargaQuimica> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async salvar(carga: CargaQuimica): Promise<CargaQuimica> {
    try {
      const salvo = await this.prisma.cargaQuimica.create({
        data: {
          id: carga.id,
          codigoCarga: carga.codigoCarga,
          idProduto: carga.idProduto,
          quantidade: carga.quantidade,
          unidadeMedida: carga.unidadeMedida,
          origem: carga.origem,
          destino: carga.destino,
          responsavelTecnico: carga.responsavelTecnico,
          documentacaoObrigatoria: carga.documentacaoObrigatoria,
          statusAtual: carga.statusAtual,
          idRemetente: carga.idRemetente,
          idResponsavelTecnico: carga.idResponsavelTecnico,
          dataEntrada: carga.dataEntrada,
          dataSaida: carga.dataSaida,
        },
      });
      return this.toDomain(salvo);
    } catch {
      this.logger.debug('Banco indisponível. Operação de carga salva em memória temporária.');
      this.memoryStore.set(carga.id, carga);
      return carga;
    }
  }

  async buscarPorId(id: string): Promise<CargaQuimica | null> {
    try {
      const registro = await this.prisma.cargaQuimica.findUnique({
        where: { id },
      });
      if (!registro) return null;
      return this.toDomain(registro);
    } catch {
      return this.memoryStore.get(id) ?? null;
    }
  }

  async buscarTodos(filtros?: FiltrosCarga): Promise<CargaQuimica[]> {
    try {
      const where: Prisma.CargaQuimicaWhereInput = {};
      if (filtros?.status) where.statusAtual = filtros.status;
      if (filtros?.idProduto) where.idProduto = filtros.idProduto;
      if (filtros?.codigoCarga) where.codigoCarga = filtros.codigoCarga;
      if (filtros?.idRemetente) where.idRemetente = filtros.idRemetente;
      if (filtros?.idResponsavelTecnico) where.idResponsavelTecnico = filtros.idResponsavelTecnico;

      const registros = await this.prisma.cargaQuimica.findMany({
        where,
        orderBy: { dataCriacao: 'desc' },
      });
      return registros.map((r) => this.toDomain(r));
    } catch {
      let itens = Array.from(this.memoryStore.values());
      if (filtros?.status) itens = itens.filter((c) => c.statusAtual === filtros.status);
      if (filtros?.idProduto) itens = itens.filter((c) => c.idProduto === filtros.idProduto);
      if (filtros?.codigoCarga) itens = itens.filter((c) => c.codigoCarga === filtros.codigoCarga);
      if (filtros?.idRemetente) itens = itens.filter((c) => c.idRemetente === filtros.idRemetente);
      if (filtros?.idResponsavelTecnico)
        itens = itens.filter((c) => c.idResponsavelTecnico === filtros.idResponsavelTecnico);
      return itens;
    }
  }

  async atualizar(carga: CargaQuimica): Promise<CargaQuimica> {
    try {
      const atualizado = await this.prisma.cargaQuimica.update({
        where: { id: carga.id },
        data: {
          statusAtual: carga.statusAtual,
          quantidade: carga.quantidade,
          unidadeMedida: carga.unidadeMedida,
          origem: carga.origem,
          destino: carga.destino,
          responsavelTecnico: carga.responsavelTecnico,
          documentacaoObrigatoria: carga.documentacaoObrigatoria,
          dataSaida: carga.dataSaida,
        },
      });
      return this.toDomain(atualizado);
    } catch {
      this.memoryStore.set(carga.id, carga);
      return carga;
    }
  }

  private toDomain(raw: {
    id: string;
    codigoCarga: string;
    idProduto: string;
    quantidade: unknown;
    unidadeMedida: string;
    origem: string;
    destino: string;
    responsavelTecnico: string;
    documentacaoObrigatoria: boolean;
    statusAtual: string;
    idRemetente: string | null;
    idResponsavelTecnico: string | null;
    dataEntrada: Date;
    dataSaida: Date | null;
    dataCriacao: Date;
    dataAtualizacao: Date;
  }): CargaQuimica {
    return new CargaQuimica({
      id: raw.id,
      codigoCarga: raw.codigoCarga,
      idProduto: raw.idProduto,
      quantidade: Number(raw.quantidade),
      unidadeMedida: raw.unidadeMedida,
      origem: raw.origem,
      destino: raw.destino,
      responsavelTecnico: raw.responsavelTecnico,
      documentacaoObrigatoria: raw.documentacaoObrigatoria,
      statusAtual: raw.statusAtual,
      idRemetente: raw.idRemetente,
      idResponsavelTecnico: raw.idResponsavelTecnico,
      dataEntrada: raw.dataEntrada,
      dataSaida: raw.dataSaida,
      dataCriacao: raw.dataCriacao,
      dataAtualizacao: raw.dataAtualizacao,
    });
  }
}
