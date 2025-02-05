import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    const BANCO_DADOS_URL = process.env.SQLITE_BANCO_DADOS_URL;
    this.logger.log(`Conectado ao Prisma!! (${BANCO_DADOS_URL})`);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
