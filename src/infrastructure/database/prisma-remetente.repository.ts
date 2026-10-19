import { Injectable, Logger } from '@nestjs/common';
import { IRemetenteRepository } from '../../domain/repositories/remetente.repository.interface.js';
import { Remetente } from '../../domain/entities/remetente.entity.js';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class PrismaRemetenteRepository implements IRemetenteRepository {
  private readonly logger = new Logger(PrismaRemetenteRepository.name);
  private readonly memoryStore: Map<string, Remetente> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async salvar(remetente: Remetente): Promise<Remetente> {
    try {
      const salvo = await this.prisma.remetente.create({
        data: {
          id: remetente.id,
          razaoSocial: remetente.razaoSocial,
          cnpj: remetente.cnpj,
          telefone: remetente.telefone,
        },
      });
      return this.toDomain(salvo);
    } catch {
      this.logger.debug('Banco indisponível. Operação simulada em memória.');
      this.memoryStore.set(remetente.id, remetente);
      return remetente;
    }
  }

  async buscarPorId(id: string): Promise<Remetente | null> {
    try {
      const registro = await this.prisma.remetente.findUnique({
        where: { id },
      });
      if (!registro) return null;
      return this.toDomain(registro);
    } catch {
      return this.memoryStore.get(id) ?? null;
    }
  }

  async buscarTodos(): Promise<Remetente[]> {
    try {
      const registros = await this.prisma.remetente.findMany({
        orderBy: { dataCriacao: 'desc' },
      });
      return registros.map((r) => this.toDomain(r));
    } catch {
      return Array.from(this.memoryStore.values());
    }
  }

  async atualizar(remetente: Remetente): Promise<Remetente> {
    try {
      const atualizado = await this.prisma.remetente.update({
        where: { id: remetente.id },
        data: {
          razaoSocial: remetente.razaoSocial,
          cnpj: remetente.cnpj,
          telefone: remetente.telefone,
        },
      });
      return this.toDomain(atualizado);
    } catch {
      this.memoryStore.set(remetente.id, remetente);
      return remetente;
    }
  }

  async remover(id: string): Promise<void> {
    try {
      await this.prisma.remetente.delete({ where: { id } });
    } catch {
      this.memoryStore.delete(id);
    }
  }

  private toDomain(raw: {
    id: string;
    razaoSocial: string;
    cnpj: string;
    telefone: string;
    dataCriacao: Date;
    dataAtualizacao: Date;
  }): Remetente {
    return new Remetente({
      id: raw.id,
      razaoSocial: raw.razaoSocial,
      cnpj: raw.cnpj,
      telefone: raw.telefone,
      dataCriacao: raw.dataCriacao,
      dataAtualizacao: raw.dataAtualizacao,
    });
  }
}
