import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
ConfigModule.forRoot({
  isGlobal: true,
});
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.enableCors();
  await app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 启用转换
      transformOptions: {
        enableImplicitConversion: true, // 启用隐式转换
      },
    }),
  );
  // await app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: '1',
  //   prefix: 'api/v',
  // });

  const config = new DocumentBuilder()
    .setTitle('Dda example')
    .setDescription('The Dda API description')
    .setVersion('1.0')
    .addTag('Dda')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log('Server Run Port', process.env.PORT);
  });
}
bootstrap();
