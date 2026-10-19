import { Module } from '@nestjs/common';
import { DocumentosCargaController } from './controllers/documentos-carga.controller.js';
import { DocumentosCargaService } from '../application/services/documentos-carga.service.js';
import { DOCUMENTO_CARGA_REPOSITORY } from '../domain/repositories/documento-carga.repository.interface.js';
import { PrismaDocumentoCargaRepository } from '../infrastructure/database/prisma-documento-carga.repository.js';
import { PrismaService } from '../infrastructure/database/prisma.service.js';

@Module({
  controllers: [DocumentosCargaController],
  providers: [
    PrismaService,
    {
      provide: DOCUMENTO_CARGA_REPOSITORY,
      useClass: PrismaDocumentoCargaRepository,
    },
    DocumentosCargaService,
  ],
  exports: [DOCUMENTO_CARGA_REPOSITORY, DocumentosCargaService],
})
export class DocumentosCargaModule {}
