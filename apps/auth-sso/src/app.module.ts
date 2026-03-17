import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Importación de controladores y servicios base
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Módulos funcionales
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { UserService } from './users/user.service';

// Configuraciones
import authConfig from './config/auth.config';
import defaultConfig from './config/default.config';
import databaseConfig from './config/mikro-orm.config';

@Module({
  imports: [
    // 1. Configuración global (Cargamos solo lo necesario para IMIX)
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        defaultConfig,
        authConfig,
      ],
    }),

    // 2. Conexión a Base de Datos (MongoDB)
    MikroOrmModule.forRoot(databaseConfig),

    // 3. Módulos de la Aplicación
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly orm: MikroORM,
    private readonly userService: UserService, // <-- Inyectamos el servicio aquí
  ) {}

  async onModuleInit() {
    const environment = this.configService.get<string>('environment');
    
    // 1. Sincronizar esquema
    if (environment === 'development' || !environment) {
      const generator = this.orm.getSchemaGenerator();
      await generator.updateSchema();
      console.log('🚀 Database schema updated');
    }

    // 2. AUTO-SEED: Crear usuario por defecto para la prueba de IMIX
    const count = await this.userService.count();
    if (count === 0) {
      console.log('🌱 No users found, seeding initial data...');
      await this.userService.create({
        username: 'admin',
        password: 'password123', // En una app real usarías bcrypt aquí
        email: 'tendero@imix.com.co',
        financialProfile: {
          availableCredit: 5000000,
          riskLevel: 'LOW',
          storeBranch: 'Sucursal Central Rural',
        }
      });
      console.log('✅ Default user "admin" created successfully');
    }
  }
}