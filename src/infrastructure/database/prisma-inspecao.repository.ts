import { Injectable, Logger } from '@nestjs/common';
import { IInspecaoRepository } from '../../domain/repositories/inspecao.repository.interface.js';
import { Inspecao } from '../../domain/entities/inspecao.entity.js';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class PrismaInspecaoRepository implements IInspecaoRepository {
  private readonly logger = new Logger(PrismaInspecaoRepository.name);
  private readonly memoryStore: Map<string, Inspecao> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async salvar(inspecao: Inspecao): Promise<Inspecao> {
    try {
      const salvo = await this.prisma.inspecao.create({
        data: {
          id: inspecao.id,
          idCarga: inspecao.idCarga,
          parecerTecnico: inspecao.parecerTecnico,
          statusInspecao: inspecao.statusInspecao,
          resultado: inspecao.resultado,
        },
      });
      return this.toDomain(salvo);
    } catch {
      this.logger.debug('Banco indisponível. Operação simulada em memória.');
      this.memoryStore.set(inspecao.id, inspecao);
      return inspecao;
    }
  }

  async buscarPorId(id: string): Promise<Inspecao | null> {
    try {
      const registro = await this.prisma.inspecao.findUnique({
        where: { id },
      });
      if (!registro) return null;
      return this.toDomain(registro);
    } catch {
      return this.memoryStore.get(id) ?? null;
    }
  }

  async buscarPorCargaId(idCarga: string): Promise<Inspecao[]> {
    try {
      const registros = await this.prisma.inspecao.findMany({
        where: { idCarga },
        orderBy: { dataCriacao: 'desc' },
      });
      return registros.map((r) => this.toDomain(r));
    } catch {
      return Array.from(this.memoryStore.values()).filter((i) => i.idCarga === idCarga);
    }
  }

  async atualizar(inspecao: Inspecao): Promise<Inspecao> {
    try {
      const atualizado = await this.prisma.inspecao.update({
        where: { id: inspecao.id },
        data: {
          parecerTecnico: inspecao.parecerTecnico,
          statusInspecao: inspecao.statusInspecao,
          resultado: inspecao.resultado,
        },
      });
      return this.toDomain(atualizado);
    } catch {
      this.memoryStore.set(inspecao.id, inspecao);
      return inspecao;
    }
  }

  private toDomain(raw: {
    id: string;
    idCarga: string;
    parecerTecnico: string | null;
    statusInspecao: string;
    resultado: boolean;
    dataCriacao: Date;
    dataAtualizacao: Date;
  }): Inspecao {
    return new Inspecao({
      id: raw.id,
      idCarga: raw.idCarga,
      parecerTecnico: raw.parecerTecnico,
      statusInspecao: raw.statusInspecao,
      resultado: raw.resultado,
      dataCriacao: raw.dataCriacao,
      dataAtualizacao: raw.dataAtualizacao,
    });
  }
}
