import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProdutosQuimicosModule } from './presentation/produtos-quimicos.module.js';
import { ResponsaveisTecnicosModule } from './presentation/responsaveis-tecnicos.module.js';
import { RemetentesModule } from './presentation/remetentes.module.js';
import { DocumentosCargaModule } from './presentation/documentos-carga.module.js';
import { InspecoesModule } from './presentation/inspecoes.module.js';
import { CargasQuimicasModule } from './presentation/cargas-quimicas.module.js';

@Module({
  imports: [
    ProdutosQuimicosModule,
    ResponsaveisTecnicosModule,
    RemetentesModule,
    DocumentosCargaModule,
    InspecoesModule,
    CargasQuimicasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
