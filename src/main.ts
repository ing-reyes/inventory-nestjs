import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CORS } from './common/constants/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  
  app.enableCors(CORS);

  app.use( morgan('dev') );

  app.setGlobalPrefix('api');
  
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      }
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Inventory Management System API')
    .setDescription('Information System - API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const configService = app.get(ConfigService);
  await app.listen( configService.get('PORT') );
  const logger = new Logger('Main');
  logger.log(`Server running on port ${configService.get('PORT')}`)
}
bootstrap();
