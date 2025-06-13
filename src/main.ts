import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';

// Fix for @nestjs/schedule crypto.randomUUID issue
if (!global.crypto) {
  global.crypto = {
    randomUUID: randomUUID,
  } as any;
}

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );

  app.use(new LoggingMiddleware().use);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
