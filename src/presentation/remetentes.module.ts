import { Module } from '@nestjs/common';
import { RemetentesController } from './controllers/remetentes.controller.js';
import { RemetentesService } from '../application/services/remetentes.service.js';
import { REMETENTE_REPOSITORY } from '../domain/repositories/remetente.repository.interface.js';
import { PrismaRemetenteRepository } from '../infrastructure/database/prisma-remetente.repository.js';
import { PrismaService } from '../infrastructure/database/prisma.service.js';

@Module({
  controllers: [RemetentesController],
  providers: [
    PrismaService,
    {
      provide: REMETENTE_REPOSITORY,
      useClass: PrismaRemetenteRepository,
    },
    RemetentesService,
  ],
  exports: [REMETENTE_REPOSITORY, RemetentesService],
})
export class RemetentesModule {}
