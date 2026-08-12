import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  /*
    En Render (y cualquier PaaS) el API está detrás de un proxy: sin esto
    `request.ip` devuelve la IP del balanceador y todos los eventos de la
    Conversions API llegan a Meta con la misma IP falsa, lo que hunde la
    calidad de emparejamiento. El 1 es el número de proxies de confianza.
  */
  app.set('trust proxy', 1);

  app.use(helmet());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: config.get<string[]>('corsOrigins'),
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = config.get<number>('port') ?? 4000;
  await app.listen(port);
  console.log(`API escuchando en http://localhost:${port}/api`);
}

void bootstrap();
