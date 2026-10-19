import { Inject, Injectable, Optional } from '@nestjs/common';
import { CargaQuimica } from '../../domain/entities/carga-quimica.entity.js';
import { BusinessRuleError, EntityNotFoundError } from '../../domain/errors/business-rule.error.js';
import { StatusCarga } from '../../domain/enums/status-carga.enum.js';
import type {
  ICargaQuimicaRepository,
  FiltrosCarga,
} from '../../domain/repositories/carga-quimica.repository.interface.js';
import { CARGA_QUIMICA_REPOSITORY } from '../../domain/repositories/carga-quimica.repository.interface.js';
import type { IProdutoQuimicoRepository } from '../../domain/repositories/produto-quimico.repository.interface.js';
import { PRODUTO_QUIMICO_REPOSITORY } from '../../domain/repositories/produto-quimico.repository.interface.js';
import type { IDocumentoCargaRepository } from '../../domain/repositories/documento-carga.repository.interface.js';
import { DOCUMENTO_CARGA_REPOSITORY } from '../../domain/repositories/documento-carga.repository.interface.js';
import { CreateCargaQuimicaDto } from '../../presentation/dto/create-carga-quimica.dto.js';

@Injectable()
export class CargasQuimicasService {
  constructor(
    @Inject(CARGA_QUIMICA_REPOSITORY)
    private readonly cargaRepository: ICargaQuimicaRepository,
    @Inject(PRODUTO_QUIMICO_REPOSITORY)
    private readonly produtoRepository: IProdutoQuimicoRepository,
    @Optional()
    @Inject(DOCUMENTO_CARGA_REPOSITORY)
    private readonly documentoRepository?: IDocumentoCargaRepository,
  ) {}

  async create(dto: CreateCargaQuimicaDto): Promise<CargaQuimica> {

    // Carga química não pode ser registrada sem produto químico associado
    const produto = await this.produtoRepository.buscarPorId(dto.idProduto);
    if (!produto) {
      throw new EntityNotFoundError('Produto químico', dto.idProduto);
    }

    // Carga química não pode ser registrada com produto químico inativo
    if (!produto.status) {
      throw new BusinessRuleError('Uma carga química não pode ser registrada com produto químico inativo.');
    }

    const carga = new CargaQuimica({
      codigoCarga: dto.codigoCarga,
      idProduto: dto.idProduto,
      quantidade: dto.quantidade,
      unidadeMedida: dto.unidadeMedida,
      origem: dto.origem,
      destino: dto.destino,
      responsavelTecnico: dto.responsavelTecnico,
      documentacaoObrigatoria: dto.documentacaoObrigatoria ?? false,
      idRemetente: dto.idRemetente,
      idResponsavelTecnico: dto.idResponsavelTecnico,
    });

    return await this.cargaRepository.salvar(carga);
  }

  // Listar Cargas Químicas com Filtro
  async findAll(filtros?: FiltrosCarga): Promise<CargaQuimica[]> {
    return await this.cargaRepository.buscarTodos(filtros);
  }

  // Buscar Carga Química por ID
  async findOne(id: string): Promise<CargaQuimica> {
    const carga = await this.cargaRepository.buscarPorId(id);
    if (!carga) {
      throw new EntityNotFoundError('Carga química', id);
    }
    return carga;
  }

  async atualizarStatus(id: string, novoStatus: StatusCarga): Promise<CargaQuimica> {
    const carga = await this.findOne(id);
    carga.transitarPara(novoStatus);
    return await this.cargaRepository.atualizar(carga);
  }

  // Bloquear Carga Químicas
  async bloquear(id: string, motivo?: any): Promise<CargaQuimica> {
    const carga = await this.findOne(id);
    carga.bloquearCarga(motivo);
    return await this.cargaRepository.atualizar(carga);
  }

  // Liberar Carga Química
  async liberar(id: string): Promise<CargaQuimica> {
    const carga = await this.findOne(id);

    // Sincroniza a validação
    if (this.documentoRepository) {
      const documentos = await this.documentoRepository.buscarPorCargaId(id);
      if (documentos.length > 0 && documentos.some((d) => d.statusValido)) {
        carga.apresentarDocumentacao();
      }
    }

    carga.liberarCarga();
    return await this.cargaRepository.atualizar(carga);
  }

  // Cancelar Carga Química
  async cancelar(id: string): Promise<CargaQuimica> {
    const carga = await this.findOne(id);
    carga.cancelarCarga();
    return await this.cargaRepository.atualizar(carga);
  }

  // Anexar/Validar Documentação Obrigatória
  async validarDocumentacao(id: string): Promise<CargaQuimica> {
    const carga = await this.findOne(id);
    carga.apresentarDocumentacao();
    return await this.cargaRepository.atualizar(carga);
  }
}
