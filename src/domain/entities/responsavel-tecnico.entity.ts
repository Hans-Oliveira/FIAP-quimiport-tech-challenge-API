import { BusinessRuleError } from '../errors/business-rule.error.js';
import { randomUUID } from 'node:crypto';

export interface ResponsavelTecnicoProps {
  id?: string;
  nome: string;
  registroProfissional: string;
  cpf: string;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}

export class ResponsavelTecnico {
  private _id: string;
  private _nome: string;
  private _registroProfissional: string;
  private _cpf: string;
  private _dataCriacao: Date;
  private _dataAtualizacao: Date;

  constructor(props: ResponsavelTecnicoProps) {
    this._id = props.id ?? randomUUID();
    this._nome = props.nome;
    this._registroProfissional = props.registroProfissional;
    this._cpf = props.cpf;
    this._dataCriacao = props.dataCriacao ?? new Date();
    this._dataAtualizacao = props.dataAtualizacao ?? new Date();

    this.validarInvariantes();
  }

  private validarInvariantes(): void {
    if (!this._nome || this._nome.trim().length === 0) {
      throw new BusinessRuleError('Nome do responsável técnico é obrigatório.');
    }
    if (!this._registroProfissional || this._registroProfissional.trim().length === 0) {
      throw new BusinessRuleError('Registro profissional (CRQ/CREA) é obrigatório.');
    }
    if (!this._cpf || this._cpf.trim().length === 0) {
      throw new BusinessRuleError('CPF do responsável técnico é obrigatório.');
    }
  }

  public atualizarDados(dados: {
    nome?: string;
    registroProfissional?: string;
    cpf?: string;
  }): void {
    if (dados.nome !== undefined) this._nome = dados.nome;
    if (dados.registroProfissional !== undefined) this._registroProfissional = dados.registroProfissional;
    if (dados.cpf !== undefined) this._cpf = dados.cpf;

    this._dataAtualizacao = new Date();
    this.validarInvariantes();
  }

  public get id(): string {
    return this._id;
  }

  public get nome(): string {
    return this._nome;
  }

  public get registroProfissional(): string {
    return this._registroProfissional;
  }

  public get cpf(): string {
    return this._cpf;
  }

  public get dataCriacao(): Date {
    return this._dataCriacao;
  }

  public get dataAtualizacao(): Date {
    return this._dataAtualizacao;
  }
}
