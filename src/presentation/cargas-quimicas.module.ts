import { Module } from '@nestjs/common';
import { CargasQuimicasController } from './controllers/cargas-quimicas.controller.js';
import { CargasQuimicasService } from '../application/services/cargas-quimicas.service.js';
import { CARGA_QUIMICA_REPOSITORY } from '../domain/repositories/carga-quimica.repository.interface.js';
import { PrismaCargaQuimicaRepository } from '../infrastructure/database/prisma-carga-quimica.repository.js';
import { PrismaService } from '../infrastructure/database/prisma.service.js';
import { ProdutosQuimicosModule } from './produtos-quimicos.module.js';
import { ResponsaveisTecnicosModule } from './responsaveis-tecnicos.module.js';
import { RemetentesModule } from './remetentes.module.js';
import { DocumentosCargaModule } from './documentos-carga.module.js';
import { InspecoesModule } from './inspecoes.module.js';

@Module({
  imports: [
    ProdutosQuimicosModule,
    ResponsaveisTecnicosModule,
    RemetentesModule,
    DocumentosCargaModule,
    InspecoesModule,
  ],
  controllers: [CargasQuimicasController],
  providers: [
    PrismaService,
    {
      provide: CARGA_QUIMICA_REPOSITORY,
      useClass: PrismaCargaQuimicaRepository,
    },
    CargasQuimicasService,
  ],
  exports: [CARGA_QUIMICA_REPOSITORY, CargasQuimicasService],
})
export class CargasQuimicasModule {}
