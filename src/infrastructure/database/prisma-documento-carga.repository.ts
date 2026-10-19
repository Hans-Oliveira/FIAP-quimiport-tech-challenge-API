import { Injectable, Logger } from '@nestjs/common';
import { IDocumentoCargaRepository } from '../../domain/repositories/documento-carga.repository.interface.js';
import { DocumentoCarga } from '../../domain/entities/documento-carga.entity.js';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class PrismaDocumentoCargaRepository implements IDocumentoCargaRepository {
  private readonly logger = new Logger(PrismaDocumentoCargaRepository.name);
  private readonly memoryStore: Map<string, DocumentoCarga> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async salvar(documento: DocumentoCarga): Promise<DocumentoCarga> {
    try {
      const salvo = await this.prisma.documentoCarga.create({
        data: {
          id: documento.id,
          idCarga: documento.idCarga,
          tipoDocumento: documento.tipoDocumento,
          dataValidade: documento.dataValidade,
          statusValido: documento.statusValido,
        },
      });
      return this.toDomain(salvo);
    } catch {
      this.logger.debug('Banco indisponível. Operação simulada em memória.');
      this.memoryStore.set(documento.id, documento);
      return documento;
    }
  }

  async buscarPorId(id: string): Promise<DocumentoCarga | null> {
    try {
      const registro = await this.prisma.documentoCarga.findUnique({
        where: { id },
      });
      if (!registro) return null;
      return this.toDomain(registro);
    } catch {
      return this.memoryStore.get(id) ?? null;
    }
  }

  async buscarPorCargaId(idCarga: string): Promise<DocumentoCarga[]> {
    try {
      const registros = await this.prisma.documentoCarga.findMany({
        where: { idCarga },
        orderBy: { dataCriacao: 'desc' },
      });
      return registros.map((r) => this.toDomain(r));
    } catch {
      return Array.from(this.memoryStore.values()).filter((d) => d.idCarga === idCarga);
    }
  }

  async atualizar(documento: DocumentoCarga): Promise<DocumentoCarga> {
    try {
      const atualizado = await this.prisma.documentoCarga.update({
        where: { id: documento.id },
        data: {
          tipoDocumento: documento.tipoDocumento,
          dataValidade: documento.dataValidade,
          statusValido: documento.statusValido,
        },
      });
      return this.toDomain(atualizado);
    } catch {
      this.memoryStore.set(documento.id, documento);
      return documento;
    }
  }

  async remover(id: string): Promise<void> {
    try {
      await this.prisma.documentoCarga.delete({ where: { id } });
    } catch {
      this.memoryStore.delete(id);
    }
  }

  private toDomain(raw: {
    id: string;
    idCarga: string;
    tipoDocumento: string;
    dataValidade: Date;
    statusValido: boolean;
    dataCriacao: Date;
    dataAtualizacao: Date;
  }): DocumentoCarga {
    return new DocumentoCarga({
      id: raw.id,
      idCarga: raw.idCarga,
      tipoDocumento: raw.tipoDocumento,
      dataValidade: raw.dataValidade,
      statusValido: raw.statusValido,
      dataCriacao: raw.dataCriacao,
      dataAtualizacao: raw.dataAtualizacao,
    });
  }
}
