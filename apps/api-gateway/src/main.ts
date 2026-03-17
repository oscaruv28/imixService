// @ts-nocheck
import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('API-Gateway');

  // --- CONFIGURACIÓN DE SWAGGER ---
  const config = new DocumentBuilder()
    .setTitle('IMIX API Gateway')
    .setDescription('Punto único de acceso para Microservicios (Auth & Credits)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const authUrl = configService.get<string>('AUTH_SERVICE_URL') || 'http://localhost:3001';
  const creditsUrl = configService.get<string>('CREDITS_SERVICE_URL') || 'http://localhost:3002';

  // Proxy para Auth
  app.use('/auth', createProxyMiddleware({
    target: authUrl,
    changeOrigin: true,
    pathRewrite: {
      '^/': '/auth/', // Lo que sea que llegue, le pegamos /auth/ adelante
    },
  }));

  // Proxy para Credits
  app.use('/credits', createProxyMiddleware({
    target: creditsUrl,
    changeOrigin: true,
    pathRewrite: {
      '^/': '/credits/', // Esto le devuelve el "/credits" que Nest le quitó
    },
  }));

  await app.listen(3000);

  logger.log(`🚀 Gateway corriendo en puerto 3000`);
  logger.log(`📖 Documentación en: http://localhost:3000/api/docs`);
}
bootstrap();