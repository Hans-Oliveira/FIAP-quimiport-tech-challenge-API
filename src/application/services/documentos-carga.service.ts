import { Inject, Injectable } from '@nestjs/common';
import { DocumentoCarga } from '../../domain/entities/documento-carga.entity.js';
import { EntityNotFoundError } from '../../domain/errors/business-rule.error.js';
import type { IDocumentoCargaRepository } from '../../domain/repositories/documento-carga.repository.interface.js';
import { DOCUMENTO_CARGA_REPOSITORY } from '../../domain/repositories/documento-carga.repository.interface.js';
import { CreateDocumentoCargaDto } from '../../presentation/dto/create-documento-carga.dto.js';

@Injectable()
export class DocumentosCargaService {
  constructor(
    @Inject(DOCUMENTO_CARGA_REPOSITORY)
    private readonly repository: IDocumentoCargaRepository,
  ) { }

  async create(dto: CreateDocumentoCargaDto): Promise<DocumentoCarga> {
    const dataValidade = new Date(dto.dataValidade);
    const documento = new DocumentoCarga({
      idCarga: dto.idCarga,
      tipoDocumento: dto.tipoDocumento,
      dataValidade,
    });

    // Validação de documento pela data
    if (dataValidade > new Date()) {
      documento.validarDocumento();
    }

    return await this.repository.salvar(documento);
  }

  async findByCargaId(idCarga: string): Promise<DocumentoCarga[]> {
    return await this.repository.buscarPorCargaId(idCarga);
  }

  async findOne(id: string): Promise<DocumentoCarga> {
    const doc = await this.repository.buscarPorId(id);
    if (!doc) {
      throw new EntityNotFoundError('Documento da carga', id);
    }
    return doc;
  }

  async validarDocumento(id: string): Promise<DocumentoCarga> {
    const doc = await this.findOne(id);
    doc.validarDocumento();
    return await this.repository.atualizar(doc);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.remover(id);
  }
}