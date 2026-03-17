import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // 1. Configuración de Logs (Misma lógica que Auth)
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: (process.env.LOG_LEVELS?.split(',') as LogLevel[]) || ['log', 'error', 'warn', 'debug'],
  });

  const logger = new Logger('bootstrap-credits');

  // 2. Configuración de Swagger (Personalizado para Créditos e IA)
  const config = new DocumentBuilder()
    .setTitle('IMIX - Credits Backend AI')
    .setDescription('Servicio de Procesamiento de Créditos con Scoring de IA')
    .addBearerAuth() // Lo dejamos listo para cuando el Gateway pase el token
    .setVersion('1.0')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);

  // 3. Obtener configuración del ConfigService
  const configService = app.get(ConfigService);
  
  // IMPORTANTE: Asegúrate de que en el .env o config de este microservicio el puerto sea 3002
  // Si no está en el config, forzamos 3002 para evitar el choque con el 3001 del Auth
  const port = configService.get<number>('port') === 3001 ? 3002 : (configService.get<number>('port') || 3002);

  // 4. Configuración global de pipes
  app.useGlobalPipes(new ValidationPipe({ 
    transform: true,
    whitelist: true,
  }));

  // 5. Seguridad y BodyParsers
  app.enableCors();
  app.useBodyParser('json', { limit: '10mb' });

  // 6. Arrancar servidor
  await app.listen(port);

  logger.log(`🚀 IMIX Credits-Backend is running on: http://localhost:${port}`);
  logger.log(`📖 Swagger docs available at: http://localhost:${port}/api/doc`);
}
bootstrap();