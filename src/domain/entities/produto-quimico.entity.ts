import { BusinessRuleError } from '../errors/business-rule.error.js';
import { randomUUID } from 'node:crypto';

export interface ProdutoQuimicoProps {
  id?: string;
  nome: string;
  classeRisco: string;
  descricao?: string | null;
  pesoUnidade?: number | null;
  numeroOnu?: string | null;
  grupoCompatibilidade?: string | null;
  status?: boolean;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}

export class ProdutoQuimico {
  private _id: string;
  private _nome: string;
  private _classeRisco: string;
  private _descricao: string | null;
  private _pesoUnidade: number | null;
  private _numeroOnu: string | null;
  private _grupoCompatibilidade: string | null;
  private _status: boolean;
  private _dataCriacao: Date;
  private _dataAtualizacao: Date;

  constructor(props: ProdutoQuimicoProps) {
    this._id = props.id ?? randomUUID();
    this._nome = props.nome;
    this._classeRisco = props.classeRisco;
    this._descricao = props.descricao ?? null;
    this._pesoUnidade = props.pesoUnidade ?? null;
    this._numeroOnu = props.numeroOnu ?? null;
    this._grupoCompatibilidade = props.grupoCompatibilidade ?? null;
    this._status = props.status ?? true;
    this._dataCriacao = props.dataCriacao ?? new Date();
    this._dataAtualizacao = props.dataAtualizacao ?? new Date();

    this.validarInvariantes();
  }

  // Validação interna das regras de negócio
  private validarInvariantes(): void {
    if (!this._nome || this._nome.trim().length === 0) {
      throw new BusinessRuleError('Um produto químico não pode ser cadastrado sem nome.');
    }

    if (!this._classeRisco || this._classeRisco.trim().length === 0) {
      throw new BusinessRuleError('Um produto químico não pode ser cadastrado sem classe de risco.');
    }

    if (this._pesoUnidade !== null && this._pesoUnidade <= 0) {
      throw new BusinessRuleError('O peso por unidade, quando informado, deve ser estritamente maior que zero.');
    }
  }

  // Metodo para inativar produto químico
  public inativar(): void {
    this._status = false;
    this._dataAtualizacao = new Date();
  }

  public reativar(): void {
    this._status = true;
    this._dataAtualizacao = new Date();
  }

  public atualizarDados(dados: {
    nome?: string;
    classeRisco?: string;
    descricao?: string | null;
    pesoUnidade?: number | null;
    numeroOnu?: string | null;
    grupoCompatibilidade?: string | null;
    status?: boolean;
  }): void {
    if (dados.nome !== undefined) this._nome = dados.nome;
    if (dados.classeRisco !== undefined) this._classeRisco = dados.classeRisco;
    if (dados.descricao !== undefined) this._descricao = dados.descricao;
    if (dados.pesoUnidade !== undefined) this._pesoUnidade = dados.pesoUnidade;
    if (dados.numeroOnu !== undefined) this._numeroOnu = dados.numeroOnu;
    if (dados.grupoCompatibilidade !== undefined) this._grupoCompatibilidade = dados.grupoCompatibilidade;
    if (dados.status !== undefined) this._status = dados.status;

    this._dataAtualizacao = new Date();
    this.validarInvariantes();
  }

  // Getters para encapsulamento das propriedades
  public get id(): string {
    return this._id;
  }

  public get nome(): string {
    return this._nome;
  }

  public get classeRisco(): string {
    return this._classeRisco;
  }

  public get descricao(): string | null {
    return this._descricao;
  }

  public get pesoUnidade(): number | null {
    return this._pesoUnidade;
  }

  public get numeroOnu(): string | null {
    return this._numeroOnu;
  }

  public get grupoCompatibilidade(): string | null {
    return this._grupoCompatibilidade;
  }

  public get status(): boolean {
    return this._status;
  }

  public get dataCriacao(): Date {
    return this._dataCriacao;
  }

  public get dataAtualizacao(): Date {
    return this._dataAtualizacao;
  }
}