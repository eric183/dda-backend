import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot({
  isGlobal: true,
});
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  await app.listen(process.env.SERVER_PORT, '0.0.0.0', () => {
    console.log('Server Run Port', process.env.SERVER_PORT);
  });
}
bootstrap();
