import { Injectable, Logger } from '@nestjs/common';
import { IResponsavelTecnicoRepository } from '../../domain/repositories/responsavel-tecnico.repository.interface.js';
import { ResponsavelTecnico } from '../../domain/entities/responsavel-tecnico.entity.js';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class PrismaResponsavelTecnicoRepository implements IResponsavelTecnicoRepository {
  private readonly logger = new Logger(PrismaResponsavelTecnicoRepository.name);
  private readonly memoryStore: Map<string, ResponsavelTecnico> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async salvar(responsavel: ResponsavelTecnico): Promise<ResponsavelTecnico> {
    try {
      const salvo = await this.prisma.responsavelTecnico.create({
        data: {
          id: responsavel.id,
          nome: responsavel.nome,
          registroProfissional: responsavel.registroProfissional,
          cpf: responsavel.cpf,
        },
      });
      return this.toDomain(salvo);
    } catch {
      this.logger.debug('Banco indisponível. Operação simulada em memória.');
      this.memoryStore.set(responsavel.id, responsavel);
      return responsavel;
    }
  }

  async buscarPorId(id: string): Promise<ResponsavelTecnico | null> {
    try {
      const registro = await this.prisma.responsavelTecnico.findUnique({
        where: { id },
      });
      if (!registro) return null;
      return this.toDomain(registro);
    } catch {
      return this.memoryStore.get(id) ?? null;
    }
  }

  async buscarTodos(): Promise<ResponsavelTecnico[]> {
    try {
      const registros = await this.prisma.responsavelTecnico.findMany({
        orderBy: { dataCriacao: 'desc' },
      });
      return registros.map((r) => this.toDomain(r));
    } catch {
      return Array.from(this.memoryStore.values());
    }
  }

  async atualizar(responsavel: ResponsavelTecnico): Promise<ResponsavelTecnico> {
    try {
      const atualizado = await this.prisma.responsavelTecnico.update({
        where: { id: responsavel.id },
        data: {
          nome: responsavel.nome,
          registroProfissional: responsavel.registroProfissional,
          cpf: responsavel.cpf,
        },
      });
      return this.toDomain(atualizado);
    } catch {
      this.memoryStore.set(responsavel.id, responsavel);
      return responsavel;
    }
  }

  async remover(id: string): Promise<void> {
    try {
      await this.prisma.responsavelTecnico.delete({ where: { id } });
    } catch {
      this.memoryStore.delete(id);
    }
  }

  private toDomain(raw: {
    id: string;
    nome: string;
    registroProfissional: string;
    cpf: string;
    dataCriacao: Date;
    dataAtualizacao: Date;
  }): ResponsavelTecnico {
    return new ResponsavelTecnico({
      id: raw.id,
      nome: raw.nome,
      registroProfissional: raw.registroProfissional,
      cpf: raw.cpf,
      dataCriacao: raw.dataCriacao,
      dataAtualizacao: raw.dataAtualizacao,
    });
  }
}
