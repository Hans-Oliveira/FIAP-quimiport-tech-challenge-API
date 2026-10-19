import { BusinessRuleError } from '../errors/business-rule.error.js';
import { randomUUID } from 'node:crypto';

export interface InspecaoProps {
  id?: string;
  idCarga: string;
  parecerTecnico?: string | null;
  statusInspecao: string;
  resultado?: boolean;
  dataCriacao?: Date;
  dataAtualizacao?: Date;
}

export class Inspecao {
  private _id: string;
  private _idCarga: string;
  private _parecerTecnico: string | null;
  private _statusInspecao: string;
  private _resultado: boolean;
  private _dataCriacao: Date;
  private _dataAtualizacao: Date;

  constructor(props: InspecaoProps) {
    this._id = props.id ?? randomUUID();
    this._idCarga = props.idCarga;
    this._parecerTecnico = props.parecerTecnico ?? null;
    this._statusInspecao = props.statusInspecao;
    this._resultado = props.resultado ?? false;
    this._dataCriacao = props.dataCriacao ?? new Date();
    this._dataAtualizacao = props.dataAtualizacao ?? new Date();

    this.validarInvariantes();
  }

  private validarInvariantes(): void {
    if (!this._idCarga || this._idCarga.trim().length === 0) {
      throw new BusinessRuleError('Inspeção deve estar vinculada a uma carga (idCarga obrigatório).');
    }
    if (!this._statusInspecao || this._statusInspecao.trim().length === 0) {
      throw new BusinessRuleError('Status da inspeção é obrigatório.');
    }
  }

  public finalizarInspecao(resultado: boolean, parecerTecnico?: string): void {
    this._resultado = resultado;
    this._statusInspecao = resultado ? 'CONCLUIDA_APROVADA' : 'CONCLUIDA_REPROVADA';
    if (parecerTecnico !== undefined) this._parecerTecnico = parecerTecnico;
    this._dataAtualizacao = new Date();
  }

  public get id(): string {
    return this._id;
  }

  public get idCarga(): string {
    return this._idCarga;
  }

  public get parecerTecnico(): string | null {
    return this._parecerTecnico;
  }

  public get statusInspecao(): string {
    return this._statusInspecao;
  }

  public get resultado(): boolean {
    return this._resultado;
  }

  public get dataCriacao(): Date {
    return this._dataCriacao;
  }

  public get dataAtualizacao(): Date {
    return this._dataAtualizacao;
  }
}
