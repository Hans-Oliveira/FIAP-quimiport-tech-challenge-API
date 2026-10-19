import { Module } from '@nestjs/common';
import { ResponsaveisTecnicosController } from './controllers/responsaveis-tecnicos.controller.js';
import { ResponsaveisTecnicosService } from '../application/services/responsaveis-tecnicos.service.js';
import { RESPONSAVEL_TECNICO_REPOSITORY } from '../domain/repositories/responsavel-tecnico.repository.interface.js';
import { PrismaResponsavelTecnicoRepository } from '../infrastructure/database/prisma-responsavel-tecnico.repository.js';
import { PrismaService } from '../infrastructure/database/prisma.service.js';

@Module({
  controllers: [ResponsaveisTecnicosController],
  providers: [
    PrismaService,
    {
      provide: RESPONSAVEL_TECNICO_REPOSITORY,
      useClass: PrismaResponsavelTecnicoRepository,
    },
    ResponsaveisTecnicosService,
  ],
  exports: [RESPONSAVEL_TECNICO_REPOSITORY, ResponsaveisTecnicosService],
})
export class ResponsaveisTecnicosModule {}
