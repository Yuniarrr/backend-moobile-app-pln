import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
// import {
//   type NestFastifyApplication,
//   FastifyAdapter,
// } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  // const app = await NestFactory.create<NestFastifyApplication>(
  //   AppModule,
  //   new FastifyAdapter(),
  // );
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  // eslint-disable-next-line @darraghor/nestjs-typed/should-specify-forbid-unknown-values
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('NestJs Boilerplate API.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, config),
  );

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

bootstrap();
