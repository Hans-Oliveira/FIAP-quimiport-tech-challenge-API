import { Module } from '@nestjs/common';
import { InspecoesController } from './controllers/inspecoes.controller.js';
import { InspecoesService } from '../application/services/inspecoes.service.js';
import { INSPECAO_REPOSITORY } from '../domain/repositories/inspecao.repository.interface.js';
import { PrismaInspecaoRepository } from '../infrastructure/database/prisma-inspecao.repository.js';
import { PrismaService } from '../infrastructure/database/prisma.service.js';

@Module({
  controllers: [InspecoesController],
  providers: [
    PrismaService,
    {
      provide: INSPECAO_REPOSITORY,
      useClass: PrismaInspecaoRepository,
    },
    InspecoesService,
  ],
  exports: [INSPECAO_REPOSITORY, InspecoesService],
})
export class InspecoesModule {}
