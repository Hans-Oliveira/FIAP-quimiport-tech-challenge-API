import { Module } from '@nestjs/common';
import { ProdutosQuimicosController } from './controllers/produtos-quimicos.controller.js';
import { CreateProdutoQuimicoUseCase } from '../application/use-cases/create-produto-quimico.use-case.js';
import { InativarProdutoQuimicoUseCase } from '../application/use-cases/inativar-produto-quimico.use-case.js';
import { ReativarProdutoQuimicoUseCase } from '../application/use-cases/reativar-produto-quimico.use-case.js';
import { FindProdutosQuimicosUseCase } from '../application/use-cases/find-produtos-quimicos.use-case.js';
import { FindProdutoQuimicoByIdUseCase } from '../application/use-cases/find-produto-quimico-by-id.use-case.js';
import { UpdateProdutoQuimicoUseCase } from '../application/use-cases/update-produto-quimico.use-case.js';
import { PRODUTO_QUIMICO_REPOSITORY } from '../domain/repositories/produto-quimico.repository.interface.js';
import { PrismaProdutoQuimicoRepository } from '../infrastructure/database/prisma-produto-quimico.repository.js';
import { PrismaService } from '../infrastructure/database/prisma.service.js';

import { ProdutosQuimicosService } from '../produtos-quimicos/produtos-quimicos.service.js';

@Module({
  controllers: [ProdutosQuimicosController],
  providers: [
    PrismaService,
    {
      provide: PRODUTO_QUIMICO_REPOSITORY,
      useClass: PrismaProdutoQuimicoRepository,
    },
    CreateProdutoQuimicoUseCase,
    InativarProdutoQuimicoUseCase,
    ReativarProdutoQuimicoUseCase,
    FindProdutosQuimicosUseCase,
    FindProdutoQuimicoByIdUseCase,
    UpdateProdutoQuimicoUseCase,
    ProdutosQuimicosService,
  ],
  exports: [PRODUTO_QUIMICO_REPOSITORY, ProdutosQuimicosService],
})
export class ProdutosQuimicosModule {}
