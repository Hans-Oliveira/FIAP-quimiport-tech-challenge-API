import { BusinessRuleError } from '../errors/business-rule.error.js';
import { randomUUID } from 'node:crypto';

export interface RemetenteProps {
  id?: string;
  razaoSocial: string;
  cnpj: string;
  telefone: string;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}

export class Remetente {
  private _id: string;
  private _razaoSocial: string;
  private _cnpj: string;
  private _telefone: string;
  private _dataCriacao: Date;
  private _dataAtualizacao: Date;

  constructor(props: RemetenteProps) {
    this._id = props.id ?? randomUUID();
    this._razaoSocial = props.razaoSocial;
    this._cnpj = props.cnpj;
    this._telefone = props.telefone;
    this._dataCriacao = props.dataCriacao ?? new Date();
    this._dataAtualizacao = props.dataAtualizacao ?? new Date();

    this.validarInvariantes();
  }

  private validarInvariantes(): void {
    if (!this._razaoSocial || this._razaoSocial.trim().length === 0) {
      throw new BusinessRuleError('Razão social da empresa remetente é obrigatória.');
    }
    if (!this._cnpj || this._cnpj.trim().length === 0) {
      throw new BusinessRuleError('CNPJ do remetente é obrigatório.');
    }
    if (!this._telefone || this._telefone.trim().length === 0) {
      throw new BusinessRuleError('Telefone de contato do remetente é obrigatório.');
    }
  }

  public atualizarDados(dados: {
    razaoSocial?: string;
    cnpj?: string;
    telefone?: string;
  }): void {
    if (dados.razaoSocial !== undefined) this._razaoSocial = dados.razaoSocial;
    if (dados.cnpj !== undefined) this._cnpj = dados.cnpj;
    if (dados.telefone !== undefined) this._telefone = dados.telefone;

    this._dataAtualizacao = new Date();
    this.validarInvariantes();
  }

  public get id(): string {
    return this._id;
  }

  public get nome(): string {
    return this._razaoSocial;
  }

  public get razaoSocial(): string {
    return this._razaoSocial;
  }

  public get cnpj(): string {
    return this._cnpj;
  }

  public get telefone(): string {
    return this._telefone;
  }

  public get dataCriacao(): Date {
    return this._dataCriacao;
  }

  public get dataAtualizacao(): Date {
    return this._dataAtualizacao;
  }
}
