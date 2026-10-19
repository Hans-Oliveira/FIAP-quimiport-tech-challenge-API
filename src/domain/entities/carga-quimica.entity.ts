import { BusinessRuleError } from '../errors/business-rule.error.js';
import { StatusCarga } from '../enums/status-carga.enum.js';
import { randomUUID } from 'node:crypto';

export interface CargaQuimicaProps {
  id?: string;
  codigoCarga: string;
  idProduto: string;
  quantidade: number;
  unidadeMedida: string;
  origem: string;
  destino: string;
  responsavelTecnico: string;
  documentacaoObrigatoria?: boolean;
  statusAtual?: StatusCarga | string;
  idRemetente?: string | null;
  idResponsavelTecnico?: string | null;
  dataEntrada?: Date;
  dataSaida?: Date | null;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}

export class CargaQuimica {
  private _id: string;
  private _codigoCarga: string;
  private _idProduto: string;
  private _quantidade: number;
  private _unidadeMedida: string;
  private _origem: string;
  private _destino: string;
  private _responsavelTecnico: string;
  private _documentacaoObrigatoria: boolean;
  private _statusAtual: StatusCarga;
  private _idRemetente: string | null;
  private _idResponsavelTecnico: string | null;
  private _dataEntrada: Date;
  private _dataSaida: Date | null;
  private _dataCriacao: Date;
  private _dataAtualizacao: Date;

  private static readonly TRANSIÇÕES_PERMITIDAS: Record<StatusCarga, StatusCarga[]> = {
    [StatusCarga.REGISTRADA]: [
      StatusCarga.EM_ANALISE,
      StatusCarga.CANCELADA,
    ],
    [StatusCarga.EM_ANALISE]: [
      StatusCarga.EM_INSPECAO,
      StatusCarga.CANCELADA,
    ],
    [StatusCarga.EM_INSPECAO]: [
      StatusCarga.LIBERADA,
      StatusCarga.BLOQUEADA,
      StatusCarga.CANCELADA,
    ],
    [StatusCarga.LIBERADA]: [
      StatusCarga.EM_MOVIMENTACAO,
      StatusCarga.CANCELADA,
    ],
    [StatusCarga.BLOQUEADA]: [
      StatusCarga.EM_INSPECAO, // Permite reavaliação técnica se regularizada
      StatusCarga.CANCELADA,
    ],
    [StatusCarga.EM_MOVIMENTACAO]: [
      StatusCarga.FINALIZADA,
    ],
    [StatusCarga.FINALIZADA]: [],
    [StatusCarga.CANCELADA]: [], 
  };

  constructor(props: CargaQuimicaProps) {
    this._id = props.id ?? randomUUID();
    this._codigoCarga = props.codigoCarga;
    this._idProduto = props.idProduto;
    this._quantidade = props.quantidade;
    this._unidadeMedida = props.unidadeMedida;
    this._origem = props.origem;
    this._destino = props.destino;
    this._responsavelTecnico = props.responsavelTecnico;
    this._documentacaoObrigatoria = props.documentacaoObrigatoria ?? false;
    this._statusAtual = (props.statusAtual as StatusCarga) ?? StatusCarga.REGISTRADA;
    this._idRemetente = props.idRemetente ?? null;
    this._idResponsavelTecnico = props.idResponsavelTecnico ?? null;
    this._dataEntrada = props.dataEntrada ?? new Date();
    this._dataSaida = props.dataSaida ?? null;
    this._dataCriacao = props.dataCriacao ?? new Date();
    this._dataAtualizacao = props.dataAtualizacao ?? new Date();

    this.validarInvariantes();
  }

  private validarInvariantes(): void {
    if (!this._codigoCarga || this._codigoCarga.trim().length === 0) {
      throw new BusinessRuleError('Código da carga é obrigatório.');
    }
    if (!this._idProduto || this._idProduto.trim().length === 0) {
      throw new BusinessRuleError('Uma carga química não pode ser registrada sem produto químico associado.');
    }
    if (this._quantidade === undefined || this._quantidade <= 0) {
      throw new BusinessRuleError('A quantidade da carga deve ser maior que zero.');
    }
    if (!this._unidadeMedida || this._unidadeMedida.trim().length === 0) {
      throw new BusinessRuleError('Unidade de medida da carga é obrigatória (ex: kg, L, ton).');
    }
    if (!this._origem || this._origem.trim().length === 0) {
      throw new BusinessRuleError('Origem da carga é obrigatória.');
    }
    if (!this._destino || this._destino.trim().length === 0) {
      throw new BusinessRuleError('Destino da carga é obrigatório.');
    }
    if (!this._responsavelTecnico || this._responsavelTecnico.trim().length === 0) {
      throw new BusinessRuleError('Toda carga deve possuir responsável técnico informado.');
    }
  }

  // Validador da Máquina de Estado
  public transitarPara(novoStatus: StatusCarga): void {
    if (this._statusAtual === novoStatus) {
      return;
    }

    if (this._statusAtual === StatusCarga.FINALIZADA || this._statusAtual === StatusCarga.CANCELADA) {
      throw new BusinessRuleError(
        `Uma carga com status "${this._statusAtual}" é terminal e não pode sofrer novas alterações de status.`,
      );
    }

    // Regra específica: bloqueada não pode entrar em movimentação
    if (this._statusAtual === StatusCarga.BLOQUEADA && novoStatus === StatusCarga.EM_MOVIMENTACAO) {
      throw new BusinessRuleError('Uma carga bloqueada não pode entrar em movimentação.');
    }

    // Regra específica: em inspeção não pode ser finalizada sem antes ser liberada
    if (this._statusAtual === StatusCarga.EM_INSPECAO && novoStatus === StatusCarga.FINALIZADA) {
      throw new BusinessRuleError('Uma carga em inspeção não pode ser finalizada sem antes ser liberada.');
    }
    
    // Regra de liberação: não pode liberar sem documentação obrigatória
    if (novoStatus === StatusCarga.LIBERADA && !this._documentacaoObrigatoria) {
      throw new BusinessRuleError('Uma carga não pode ser liberada sem documentação obrigatória.');
    }

    const permitidas = CargaQuimica.TRANSIÇÕES_PERMITIDAS[this._statusAtual] ?? [];
    if (!permitidas.includes(novoStatus)) {
      throw new BusinessRuleError(
        `Transição proibida: não é permitido transitar de "${this._statusAtual}" para "${novoStatus}".`,
      );
    }

    if (novoStatus === StatusCarga.FINALIZADA) {
      this._dataSaida = new Date();
    }

    this._statusAtual = novoStatus;
    this._dataAtualizacao = new Date();
  }

  public liberarCarga(): void {
    this.transitarPara(StatusCarga.LIBERADA);
  }

  public bloquearCarga(motivo?: string): void {
    if (this._statusAtual === StatusCarga.FINALIZADA || this._statusAtual === StatusCarga.CANCELADA) {
      throw new BusinessRuleError(`Não é possível bloquear uma carga que já está ${this._statusAtual}.`);
    }
    this._statusAtual = StatusCarga.BLOQUEADA;
    this._dataAtualizacao = new Date();
  }

  public cancelarCarga(): void {
    this.transitarPara(StatusCarga.CANCELADA);
  }

  public apresentarDocumentacao(): void {
    this._documentacaoObrigatoria = true;
    this._dataAtualizacao = new Date();
  }

  public atualizarDados(dados: {
    origem?: string;
    destino?: string;
    responsavelTecnico?: string;
    quantidade?: number;
    unidadeMedida?: string;
    documentacaoObrigatoria?: boolean;
  }): void {
    if (this._statusAtual === StatusCarga.FINALIZADA || this._statusAtual === StatusCarga.CANCELADA) {
      throw new BusinessRuleError('Cargas finalizadas ou canceladas não podem ter seus dados alterados.');
    }

    if (dados.origem !== undefined) this._origem = dados.origem;
    if (dados.destino !== undefined) this._destino = dados.destino;
    if (dados.responsavelTecnico !== undefined) this._responsavelTecnico = dados.responsavelTecnico;
    if (dados.quantidade !== undefined) this._quantidade = dados.quantidade;
    if (dados.unidadeMedida !== undefined) this._unidadeMedida = dados.unidadeMedida;
    if (dados.documentacaoObrigatoria !== undefined) this._documentacaoObrigatoria = dados.documentacaoObrigatoria;

    this._dataAtualizacao = new Date();
    this.validarInvariantes();
  }

  // Getters
  public get id(): string {
    return this._id;
  }

  public get codigoCarga(): string {
    return this._codigoCarga;
  }

  public get idProduto(): string {
    return this._idProduto;
  }

  public get quantidade(): number {
    return this._quantidade;
  }

  public get unidadeMedida(): string {
    return this._unidadeMedida;
  }

  public get origem(): string {
    return this._origem;
  }

  public get destino(): string {
    return this._destino;
  }

  public get responsavelTecnico(): string {
    return this._responsavelTecnico;
  }

  public get documentacaoObrigatoria(): boolean {
    return this._documentacaoObrigatoria;
  }

  public get statusAtual(): StatusCarga {
    return this._statusAtual;
  }

  public get idRemetente(): string | null {
    return this._idRemetente;
  }

  public get idResponsavelTecnico(): string | null {
    return this._idResponsavelTecnico;
  }

  public get dataEntrada(): Date {
    return this._dataEntrada;
  }

  public get dataSaida(): Date | null {
    return this._dataSaida;
  }

  public get dataCriacao(): Date {
    return this._dataCriacao;
  }

  public get dataAtualizacao(): Date {
    return this._dataAtualizacao;
  }
}