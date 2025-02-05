import 'reflect-metadata';

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { get as env } from 'env-var';
import { defaultTo } from 'lodash';

import { AppModule } from './app';

(async () => {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.enableShutdownHooks();
  app.enableCors();
  app.enableVersioning();

  const host = env('APP_API_HOST_ADDRESS').asString();
  const port = env('APP_API_HOST_PORT').required().asPortNumber();

  await app.listen(port, host);

  // this is only for logging purposes
  return { host: defaultTo(host, '0.0.0.0'), port };
})()
  .then(({ host, port }) => {
    Logger.log(`🚀 Application is running on: http://${host}:${port}`);
  })
  .catch((error) => {
    Logger.error(`❌ Error starting the application: ${error}`);
    process.exit(1);
  });
