import { Inject, Injectable } from '@nestjs/common';
import { Inspecao } from '../../domain/entities/inspecao.entity.js';
import { EntityNotFoundError } from '../../domain/errors/business-rule.error.js';
import type { IInspecaoRepository } from '../../domain/repositories/inspecao.repository.interface.js';
import { INSPECAO_REPOSITORY } from '../../domain/repositories/inspecao.repository.interface.js';
import { CreateInspecaoDto } from '../../presentation/dto/create-inspecao.dto.js';

@Injectable()
export class InspecoesService {
  constructor(
    @Inject(INSPECAO_REPOSITORY)
    private readonly repository: IInspecaoRepository,
  ) {}

  async create(dto: CreateInspecaoDto): Promise<Inspecao> {
    const inspecao = new Inspecao({
      idCarga: dto.idCarga,
      statusInspecao: dto.statusInspecao,
      resultado: dto.resultado,
      parecerTecnico: dto.parecerTecnico,
    });
    return await this.repository.salvar(inspecao);
  }

  async findByCargaId(idCarga: string): Promise<Inspecao[]> {
    return await this.repository.buscarPorCargaId(idCarga);
  }

  async findOne(id: string): Promise<Inspecao> {
    const inspecao = await this.repository.buscarPorId(id);
    if (!inspecao) {
      throw new EntityNotFoundError('Inspeção', id);
    }
    return inspecao;
  }
}