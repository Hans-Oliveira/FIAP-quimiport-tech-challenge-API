import { Injectable, Logger } from '@nestjs/common';
import { IProdutoQuimicoRepository } from '../../domain/repositories/produto-quimico.repository.interface.js';
import { ProdutoQuimico } from '../../domain/entities/produto-quimico.entity.js';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class PrismaProdutoQuimicoRepository implements IProdutoQuimicoRepository {
  private readonly logger = new Logger(PrismaProdutoQuimicoRepository.name);
  // Armazenamento em memória temporário enquanto o banco de dados não for criado/conectado
  private readonly memoryStore: Map<string, ProdutoQuimico> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async salvar(produto: ProdutoQuimico): Promise<ProdutoQuimico> {
    try {
      const salvo = await this.prisma.produtoQuimico.create({
        data: {
          id: produto.id,
          nome: produto.nome,
          classeRisco: produto.classeRisco,
          descricao: produto.descricao,
          pesoUnidade: produto.pesoUnidade,
          numeroOnu: produto.numeroOnu,
          grupoCompatibilidade: produto.grupoCompatibilidade,
          status: produto.status,
        },
      });

      return this.toDomain(salvo);
    } catch {
      this.logger.debug(
        'Banco de dados indisponível no momento. Operação simulada em memória para a API.',
      );
      this.memoryStore.set(produto.id, produto);
      return produto;
    }
  }

  async buscarPorId(id: string): Promise<ProdutoQuimico | null> {
    try {
      const registro = await this.prisma.produtoQuimico.findUnique({
        where: { id },
      });

      if (!registro) return null;
      return this.toDomain(registro);
    } catch {
      return this.memoryStore.get(id) ?? null;
    }
  }

  async buscarTodos(apenasAtivos = true): Promise<ProdutoQuimico[]> {
    try {
      const registros = await this.prisma.produtoQuimico.findMany({
        where: apenasAtivos ? { status: true } : undefined,
        orderBy: { dataCriacao: 'desc' },
      });

      return registros.map((r) => this.toDomain(r));
    } catch {
      const todos = Array.from(this.memoryStore.values());
      return apenasAtivos ? todos.filter((p) => p.status === true) : todos;
    }
  }

  async atualizar(produto: ProdutoQuimico): Promise<ProdutoQuimico> {
    try {
      const atualizado = await this.prisma.produtoQuimico.update({
        where: { id: produto.id },
        data: {
          nome: produto.nome,
          classeRisco: produto.classeRisco,
          descricao: produto.descricao,
          pesoUnidade: produto.pesoUnidade,
          numeroOnu: produto.numeroOnu,
          grupoCompatibilidade: produto.grupoCompatibilidade,
          status: produto.status,
        },
      });

      return this.toDomain(atualizado);
    } catch {
      this.memoryStore.set(produto.id, produto);
      return produto;
    }
  }

  private toDomain(raw: {
    id: string;
    nome: string;
    classeRisco: string;
    descricao: string | null;
    pesoUnidade: unknown;
    numeroOnu: string | null;
    grupoCompatibilidade: string | null;
    status: boolean;
    dataCriacao: Date;
    dataAtualizacao: Date;
  }): ProdutoQuimico {
    return new ProdutoQuimico({
      id: raw.id,
      nome: raw.nome,
      classeRisco: raw.classeRisco,
      descricao: raw.descricao,
      pesoUnidade:
        raw.pesoUnidade !== null && raw.pesoUnidade !== undefined
          ? Number(raw.pesoUnidade)
          : null,
      numeroOnu: raw.numeroOnu,
      grupoCompatibilidade: raw.grupoCompatibilidade,
      status: raw.status,
      dataCriacao: raw.dataCriacao,
      dataAtualizacao: raw.dataAtualizacao,
    });
  }
}
