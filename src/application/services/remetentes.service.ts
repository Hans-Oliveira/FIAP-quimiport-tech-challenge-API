import { Inject, Injectable } from '@nestjs/common';
import { Remetente } from '../../domain/entities/remetente.entity.js';
import { EntityNotFoundError } from '../../domain/errors/business-rule.error.js';
import type { IRemetenteRepository } from '../../domain/repositories/remetente.repository.interface.js';
import { REMETENTE_REPOSITORY } from '../../domain/repositories/remetente.repository.interface.js';
import { CreateRemetenteDto } from '../../presentation/dto/create-remetente.dto.js';
import { UpdateRemetenteDto } from '../../presentation/dto/update-remetente.dto.js';

@Injectable()
export class RemetentesService {
  constructor(
    @Inject(REMETENTE_REPOSITORY)
    private readonly repository: IRemetenteRepository,
  ) {}

  async create(dto: CreateRemetenteDto): Promise<Remetente> {
    const remetente = new Remetente({
      razaoSocial: dto.razaoSocial,
      cnpj: dto.cnpj,
      telefone: dto.telefone,
    });
    return await this.repository.salvar(remetente);
  }

  async findAll(): Promise<Remetente[]> {
    return await this.repository.buscarTodos();
  }

  async findOne(id: string): Promise<Remetente> {
    const remetente = await this.repository.buscarPorId(id);
    if (!remetente) {
      throw new EntityNotFoundError('Remetente', id);
    }
    return remetente;
  }

  async update(id: string, dto: UpdateRemetenteDto): Promise<Remetente> {
    const remetente = await this.findOne(id);
    remetente.atualizarDados(dto);
    return await this.repository.atualizar(remetente);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.remover(id);
  }
}