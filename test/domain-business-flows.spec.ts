import { describe, expect, it, vi } from 'vitest';
import { CargasQuimicasService } from '../src/application/services/cargas-quimicas.service.js';
import {
  CreateProdutoQuimicoUseCase,
  type CreateProdutoQuimicoInput,
} from '../src/application/use-cases/create-produto-quimico.use-case.js';
import { CargaQuimica } from '../src/domain/entities/carga-quimica.entity.js';
import { ProdutoQuimico } from '../src/domain/entities/produto-quimico.entity.js';
import { BusinessRuleError } from '../src/domain/errors/business-rule.error.js';
import { StatusCarga } from '../src/domain/enums/status-carga.enum.js';
import type { ICargaQuimicaRepository } from '../src/domain/repositories/carga-quimica.repository.interface.js';
import type { IProdutoQuimicoRepository } from '../src/domain/repositories/produto-quimico.repository.interface.js';

const produtoInput: CreateProdutoQuimicoInput = {
  nome: 'Ácido sulfúrico',
  classeRisco: 'Classe 8',
};

function criarProduto(status = true): ProdutoQuimico {
  return new ProdutoQuimico({
    id: 'produto-1',
    nome: 'Ácido sulfúrico',
    classeRisco: 'Classe 8',
    status,
  });
}

function criarCarga(
  statusAtual: StatusCarga = StatusCarga.REGISTRADA,
  documentacaoObrigatoria = false,
): CargaQuimica {
  return new CargaQuimica({
    id: 'carga-1',
    codigoCarga: 'CRG-2026-001',
    idProduto: 'produto-1',
    quantidade: 100,
    unidadeMedida: 'kg',
    origem: 'Santos',
    destino: 'Terminal químico',
    responsavelTecnico: 'Responsável técnico',
    statusAtual,
    documentacaoObrigatoria,
  });
}

function criarRepositorioProduto() {
  const salvarProduto = vi.fn(async (produto: ProdutoQuimico) => produto);
  const repository: IProdutoQuimicoRepository = {
    salvar: salvarProduto,
    buscarPorId: vi.fn(async () => null),
    buscarTodos: vi.fn(async () => []),
    atualizar: vi.fn(async (produto: ProdutoQuimico) => produto),
  };

  return { repository, salvarProduto };
}

function criarRepositoriosCarga(cargas: CargaQuimica[]) {
  const salvarCarga = vi.fn(async (carga: CargaQuimica) => carga);
  const atualizarCarga = vi.fn(async (carga: CargaQuimica) => carga);
  const buscarProduto = vi.fn(async () => criarProduto());
  const cargaRepository: ICargaQuimicaRepository = {
    salvar: salvarCarga,
    buscarPorId: vi.fn(async (id: string) => cargas.find((carga) => carga.id === id) ?? null),
    buscarTodos: vi.fn(async () => cargas),
    atualizar: atualizarCarga,
  };
  const produtoRepository: IProdutoQuimicoRepository = {
    salvar: vi.fn(async (produto: ProdutoQuimico) => produto),
    buscarPorId: buscarProduto,
    buscarTodos: vi.fn(async () => []),
    atualizar: vi.fn(async (produto: ProdutoQuimico) => produto),
  };

  return {
    cargaRepository,
    produtoRepository,
    salvarCarga,
    atualizarCarga,
    buscarProduto,
    service: new CargasQuimicasService(cargaRepository, produtoRepository),
  };
}

describe('Fluxos e regras de negócio de produtos e cargas químicas', () => {
  it('cadastra um produto químico com nome e classe de risco', async () => {
    const { repository, salvarProduto } = criarRepositorioProduto();

    const produto = await new CreateProdutoQuimicoUseCase(repository).execute(produtoInput);

    expect(produto.nome).toBe(produtoInput.nome);
    expect(produto.classeRisco).toBe(produtoInput.classeRisco);
    expect(produto.status).toBe(true);
    expect(salvarProduto).toHaveBeenCalledWith(produto);
  });

  it('bloqueia o cadastro de produto químico sem nome', async () => {
    const { repository, salvarProduto } = criarRepositorioProduto();

    await expect(
      new CreateProdutoQuimicoUseCase(repository).execute({ ...produtoInput, nome: '  ' }),
    ).rejects.toThrow(BusinessRuleError);
    expect(salvarProduto).not.toHaveBeenCalled();
  });

  it('bloqueia o cadastro de produto químico sem classe de risco', async () => {
    const { repository, salvarProduto } = criarRepositorioProduto();

    await expect(
      new CreateProdutoQuimicoUseCase(repository).execute({
        ...produtoInput,
        classeRisco: '',
      }),
    ).rejects.toThrow(BusinessRuleError);
    expect(salvarProduto).not.toHaveBeenCalled();
  });

  it('registra uma carga vinculada a um produto ativo', async () => {
    const { service, salvarCarga } = criarRepositoriosCarga([]);

    const carga = await service.create({
      codigoCarga: 'CRG-2026-001',
      idProduto: 'produto-1',
      quantidade: 100,
      unidadeMedida: 'kg',
      origem: 'Santos',
      destino: 'Terminal químico',
      responsavelTecnico: 'Responsável técnico',
    });

    expect(carga.statusAtual).toBe(StatusCarga.REGISTRADA);
    expect(salvarCarga).toHaveBeenCalledWith(carga);
  });

  it('bloqueia o registro de carga com produto químico inativo', async () => {
    const { service, salvarCarga, buscarProduto } = criarRepositoriosCarga([]);
    buscarProduto.mockResolvedValue(criarProduto(false));

    await expect(
      service.create({
        codigoCarga: 'CRG-2026-001',
        idProduto: 'produto-1',
        quantidade: 100,
        unidadeMedida: 'kg',
        origem: 'Santos',
        destino: 'Terminal químico',
        responsavelTecnico: 'Responsável técnico',
      }),
    ).rejects.toThrow(BusinessRuleError);
    expect(salvarCarga).not.toHaveBeenCalled();
  });

  it.each([0, -1])('bloqueia carga com quantidade %s', async (quantidade) => {
    const { service, salvarCarga } = criarRepositoriosCarga([]);

    await expect(
      service.create({
        codigoCarga: 'CRG-2026-001',
        idProduto: 'produto-1',
        quantidade,
        unidadeMedida: 'kg',
        origem: 'Santos',
        destino: 'Terminal químico',
        responsavelTecnico: 'Responsável técnico',
      }),
    ).rejects.toThrow(BusinessRuleError);
    expect(salvarCarga).not.toHaveBeenCalled();
  });

  it('bloqueia a liberação da carga sem documentação obrigatória', async () => {
    const { service, atualizarCarga } = criarRepositoriosCarga([
      criarCarga(StatusCarga.EM_INSPECAO),
    ]);

    await expect(service.liberar('carga-1')).rejects.toThrow(
      'Uma carga não pode ser liberada sem documentação obrigatória.',
    );
    expect(atualizarCarga).not.toHaveBeenCalled();
  });

  it('atualiza o status da carga quando a transição é permitida', async () => {
    const carga = criarCarga();
    const { service, atualizarCarga } = criarRepositoriosCarga([carga]);

    const atualizada = await service.atualizarStatus('carga-1', StatusCarga.EM_ANALISE);

    expect(atualizada.statusAtual).toBe(StatusCarga.EM_ANALISE);
    expect(atualizarCarga).toHaveBeenCalledWith(carga);
  });

  const transicoesPermitidas: Array<[StatusCarga, StatusCarga]> = [
    [StatusCarga.REGISTRADA, StatusCarga.EM_ANALISE],
    [StatusCarga.REGISTRADA, StatusCarga.CANCELADA],
    [StatusCarga.EM_ANALISE, StatusCarga.EM_INSPECAO],
    [StatusCarga.EM_ANALISE, StatusCarga.CANCELADA],
    [StatusCarga.EM_INSPECAO, StatusCarga.LIBERADA],
    [StatusCarga.EM_INSPECAO, StatusCarga.BLOQUEADA],
    [StatusCarga.EM_INSPECAO, StatusCarga.CANCELADA],
    [StatusCarga.LIBERADA, StatusCarga.EM_MOVIMENTACAO],
    [StatusCarga.LIBERADA, StatusCarga.CANCELADA],
    [StatusCarga.BLOQUEADA, StatusCarga.EM_INSPECAO],
    [StatusCarga.BLOQUEADA, StatusCarga.CANCELADA],
    [StatusCarga.EM_MOVIMENTACAO, StatusCarga.FINALIZADA],
  ];

  it.each(transicoesPermitidas)(
    'permite transição de "%s" para "%s"',
    (statusAtual, novoStatus) => {
      const carga = criarCarga(statusAtual, novoStatus === StatusCarga.LIBERADA);

      expect(() => carga.transitarPara(novoStatus)).not.toThrow();
      expect(carga.statusAtual).toBe(novoStatus);
    },
  );

  const transicoesProibidas = Object.values(StatusCarga).flatMap((statusAtual) =>
    Object.values(StatusCarga)
      .filter(
        (novoStatus) =>
          novoStatus !== statusAtual &&
          !transicoesPermitidas.some(
            ([permitidoDe, permitidoPara]) =>
              permitidoDe === statusAtual && permitidoPara === novoStatus,
          ),
      )
      .map((novoStatus) => [statusAtual, novoStatus] as const),
  );

  it.each(transicoesProibidas)(
    'bloqueia transição proibida de "%s" para "%s"',
    (statusAtual, novoStatus) => {
      const carga = criarCarga(statusAtual, true);

      expect(() => carga.transitarPara(novoStatus)).toThrow(BusinessRuleError);
    },
  );

  it('cancela uma carga registrada', async () => {
    const carga = criarCarga();
    const { service } = criarRepositoriosCarga([carga]);

    const cancelada = await service.cancelar('carga-1');

    expect(cancelada.statusAtual).toBe(StatusCarga.CANCELADA);
  });

  it('bloqueia a tentativa de movimentar uma carga bloqueada', async () => {
    const carga = criarCarga(StatusCarga.BLOQUEADA);
    const { service, atualizarCarga } = criarRepositoriosCarga([carga]);

    await expect(
      service.atualizarStatus('carga-1', StatusCarga.EM_MOVIMENTACAO),
    ).rejects.toThrow('Uma carga bloqueada não pode entrar em movimentação.');
    expect(atualizarCarga).not.toHaveBeenCalled();
  });
});
