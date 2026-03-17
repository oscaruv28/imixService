import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // 1. Configuración de Logs dinámica desde el .env
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: (process.env.LOG_LEVELS?.split(',') as LogLevel[]) || ['log', 'error', 'warn', 'debug'],
  });

  const logger = new Logger('bootstrap');

  // 2. Configuración de Swagger (Ajustado a IMIX)
  const config = new DocumentBuilder()
    .setTitle('IMIX - Auth SSO API')
    .setDescription('Servicio de Autenticación y Gestión de Sesiones')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  // Usamos 'api/doc' como en tu ejemplo
  SwaggerModule.setup('api/doc', app, document);

  // 3. Obtener configuración del ConfigService
  const configService = app.get(ConfigService);
  // Ojo: asegúrate que en tu config el puerto sea 3001 para no chocar con otros microservicios
  const port = configService.get<number>('port') || 3001;

  // 4. Configuración global de pipes (Validation + Transformation)
  app.useGlobalPipes(new ValidationPipe({ 
    transform: true,
    whitelist: true,
  }));

  // 5. Seguridad y BodyParsers
  app.enableCors();
  app.useBodyParser('text', { limit: '50mb' });
  app.useBodyParser('json', { limit: '50mb' });

  // 6. Arrancar servidor
  await app.listen(port);

  logger.log(`🚀 IMIX Auth-SSO is running on: ${await app.getUrl()}`);
  logger.log(`📖 Swagger docs available at: ${await app.getUrl()}/api/doc`);
}
bootstrap();