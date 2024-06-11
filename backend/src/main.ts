import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Укажите здесь ваш клиентский домен
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(3000);
}
bootstrap();
