import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// わざわざこれを記述する必要があるのか。単純にグローバル変数でPrismaClientを保持しておけばいいのでは？と思うが、
// Nest.jsの責任分離の考え方に従うならこういう記述のほうがいいのかな。
// ただPrismaの公式ドキュメントでは、$disconnect()を直接呼ぶことは推奨しない書いてある。
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
