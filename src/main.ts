import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe with transformation enabled
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
