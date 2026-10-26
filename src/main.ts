import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DomainExceptionFilter } from './presentation/filters/domain-exception.filter.js';
import { MetricsService } from './observability/metrics.service.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const metrics = app.get(MetricsService);

  // Tratamento de exceções de domínio/regras de negócio
  app.useGlobalFilters(new DomainExceptionFilter());

  // Class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        metrics.recordValidationError(errors.length);
        const messages = errors.flatMap((error) =>
          Object.values(error.constraints ?? {}),
        );

        return new BadRequestException({
          statusCode: 400,
          error: 'Validation failed',
          message: messages,
        });
      },
    }),
  );

  // Configuração básica do Swagger
  const config = new DocumentBuilder()
    .setTitle('Tech Challenge 2 - API')
    .setDescription('Documentação dos endpoints da API')
    .setVersion('1.0')
    // .addBearerAuth() // descomente se for usar autenticação JWT mais adiante
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();