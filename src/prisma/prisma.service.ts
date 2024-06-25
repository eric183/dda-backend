import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    console.log('DB inited');
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      console.log('DB client is exiting');
      app.close();

      await this.$disconnect();
    });

    // this.$on('beforeExit', async () => {
    //   await this.$disconnect();
    // });
  }
}
