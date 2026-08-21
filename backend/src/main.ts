import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { json } from 'express';
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

  /*
    La exportación a .xlsx manda la tabla completa ya formateada en el body,
    así que el límite por defecto de 100 kB de body-parser se queda corto en
    cuanto la lista pasa de unos cientos de leads (Express responde 413
    "request entity too large"). Se sube solo en esa ruta: el resto del API
    —incluido el POST público de creación de leads— sigue con 100 kB.
    Va antes de `listen()`, que es donde Nest registra los parsers por
    defecto; body-parser marca el request como ya leído y el global lo salta.
  */
  app.use('/api/leads/export/xlsx', json({ limit: '20mb' }));

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
