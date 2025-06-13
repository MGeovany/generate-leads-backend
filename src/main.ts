import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { randomUUID } from 'crypto';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { env } from './config/env';

// Fix for @nestjs/schedule crypto.randomUUID issue
if (!global.crypto) {
  global.crypto = {
    randomUUID: randomUUID,
  } as any;
}

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

  const config = new DocumentBuilder()
    .setTitle('Generate Leads API')
    .setDescription('Backend API for automation and AI-powered replies')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(env.PORT ? Number(env.PORT) : 3000);
}
bootstrap();
