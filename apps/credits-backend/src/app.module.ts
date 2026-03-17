import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Importación de controladores y servicios base
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Módulos funcionales (Asegúrate de crear el CreditsModule)
import { CreditsModule } from './credits/credits.module';

// Configuraciones (Copia la estructura de carpetas de config del SSO)
import defaultConfig from './config/default.config';
import databaseConfig from './config/mikro-orm.config';

@Module({
  imports: [
    // 1. Configuración global (Cargamos el puerto y variables de entorno)
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        defaultConfig,
      ],
    }),

    // 2. Conexión a Base de Datos (Misma instancia de MongoDB)
    MikroOrmModule.forRoot(databaseConfig),

    // 3. Módulo de lógica de negocio
    CreditsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly orm: MikroORM,
  ) {}

  async onModuleInit() {
    const environment = this.configService.get<string>('environment');
    
    // Sincronización automática para asegurar que las colecciones de créditos existan
    if (environment === 'development' || !environment) {
      const generator = this.orm.getSchemaGenerator();
      await generator.updateSchema();
      console.log('🚀 Credits database schema updated');
    }
  }
}