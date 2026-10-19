import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Conexão com o banco de dados estabelecida via Prisma.');
    } catch (error) {
      this.logger.warn(
        'Não foi possível conectar ao banco de dados no momento. Verifique se o MySQL está rodando.',
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
