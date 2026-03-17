import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthOptions } from '../config/auth.config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const authOptions = configService.get<AuthOptions>('auth');
        return {
          secret: authOptions?.secret || 'development_secret',
          signOptions: {
            expiresIn: (authOptions?.expiresIn || '1d') as any,
          },
        };
      },
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy], // <--- AGREGAR JwtStrategy
  controllers: [AuthController],
  exports: [AuthService, PassportModule], // <--- EXPORTAR PassportModule
})
export class AuthModule {}