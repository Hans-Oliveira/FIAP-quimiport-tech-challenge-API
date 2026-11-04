import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DomainExceptionFilter } from './presentation/filters/domain-exception.filter.js';
import { LoggingInterceptor } from './presentation/interceptors/logging.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Interceptor global de logs para observabilidade HTTP
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Tratamento de exceções de domínio/regras de negócio
  app.useGlobalFilters(new DomainExceptionFilter());

  // Class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Configuração básica do Swagger
  const config = new DocumentBuilder()
    .setTitle('QuimiPort API - Tech Challenge Fase 2')
    .setDescription('Documentação dos endpoints da API QuimiPort (Porto de Santos)')
    .setVersion('2.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();