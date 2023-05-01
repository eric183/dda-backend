import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot({
  isGlobal: true,
});
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  console.log('server_port!!!!', process.env.SERVER_POST);
  await app.listen(process.env.SERVER_POST, '0.0.0.0');
}
bootstrap();
