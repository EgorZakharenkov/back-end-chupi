import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json({ limit: '1mb' }));
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.use('/files', express.static(path.join(__dirname, '..', 'files')));
  await app.listen(4444);
}
bootstrap();
