import { Inject, Injectable } from '@nestjs/common';
import { ResponsavelTecnico } from '../../domain/entities/responsavel-tecnico.entity.js';
import { EntityNotFoundError } from '../../domain/errors/business-rule.error.js';
import type { IResponsavelTecnicoRepository } from '../../domain/repositories/responsavel-tecnico.repository.interface.js';
import { RESPONSAVEL_TECNICO_REPOSITORY } from '../../domain/repositories/responsavel-tecnico.repository.interface.js';
import { CreateResponsavelTecnicoDto } from '../../presentation/dto/create-responsavel-tecnico.dto.js';
import { UpdateResponsavelTecnicoDto } from '../../presentation/dto/update-responsavel-tecnico.dto.js';

@Injectable()
export class ResponsaveisTecnicosService {
  constructor(
    @Inject(RESPONSAVEL_TECNICO_REPOSITORY)
    private readonly repository: IResponsavelTecnicoRepository,
  ) {}

  async create(dto: CreateResponsavelTecnicoDto): Promise<ResponsavelTecnico> {
    const responsavel = new ResponsavelTecnico({
      nome: dto.nome,
      registroProfissional: dto.registroProfissional,
      cpf: dto.cpf,
    });
    return await this.repository.salvar(responsavel);
  }

  async findAll(): Promise<ResponsavelTecnico[]> {
    return await this.repository.buscarTodos();
  }

  async findOne(id: string): Promise<ResponsavelTecnico> {
    const responsavel = await this.repository.buscarPorId(id);
    if (!responsavel) {
      throw new EntityNotFoundError('Responsável técnico', id);
    }
    return responsavel;
  }

  async update(id: string, dto: UpdateResponsavelTecnicoDto): Promise<ResponsavelTecnico> {
    const responsavel = await this.findOne(id);
    responsavel.atualizarDados(dto);
    return await this.repository.atualizar(responsavel);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.remover(id);
  }
}