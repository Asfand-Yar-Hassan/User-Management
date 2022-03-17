import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as CookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(CookieParser());
  await app.listen(3000);
}
bootstrap();
