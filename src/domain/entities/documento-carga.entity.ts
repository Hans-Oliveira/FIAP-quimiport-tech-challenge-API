import { BusinessRuleError } from '../errors/business-rule.error.js';
import { randomUUID } from 'node:crypto';

export interface DocumentoCargaProps {
  id?: string;
  idCarga: string;
  tipoDocumento: string;
  dataValidade: Date;
  statusValido?: boolean;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}

export class DocumentoCarga {
  private _id: string;
  private _idCarga: string;
  private _tipoDocumento: string;
  private _dataValidade: Date;
  private _statusValido: boolean;
  private _dataCriacao: Date;
  private _dataAtualizacao: Date;

  constructor(props: DocumentoCargaProps) {
    this._id = props.id ?? randomUUID();
    this._idCarga = props.idCarga;
    this._tipoDocumento = props.tipoDocumento;
    this._dataValidade = props.dataValidade;
    this._statusValido = props.statusValido ?? false;
    this._dataCriacao = props.dataCriacao ?? new Date();
    this._dataAtualizacao = props.dataAtualizacao ?? new Date();

    this.validarInvariantes();
  }

  private validarInvariantes(): void {
    if (!this._idCarga || this._idCarga.trim().length === 0) {
      throw new BusinessRuleError('Documento deve estar vinculado a uma carga (idCarga obrigatório).');
    }
    if (!this._tipoDocumento || this._tipoDocumento.trim().length === 0) {
      throw new BusinessRuleError('Tipo de documento obrigatório.');
    }
    if (!this._dataValidade || isNaN(this._dataValidade.getTime())) {
      throw new BusinessRuleError('Data de validade do documento inválida.');
    }
  }

  // Validar documento
  public validarDocumento(): void {
    const hoje = new Date();
    if (this._dataValidade <= hoje) {
      this._statusValido = false;
      throw new BusinessRuleError('Documento com data de validade expirada não pode ser validado.');
    }
    this._statusValido = true;
    this._dataAtualizacao = new Date();
  }

  public get id(): string {
    return this._id;
  }

  public get idCarga(): string {
    return this._idCarga;
  }

  public get tipoDocumento(): string {
    return this._tipoDocumento;
  }

  public get dataValidade(): Date {
    return this._dataValidade;
  }

  public get statusValido(): boolean {
    return this._statusValido;
  }

  public get dataCriacao(): Date {
    return this._dataCriacao;
  }

  public get dataAtualizacao(): Date {
    return this._dataAtualizacao;
  }
}