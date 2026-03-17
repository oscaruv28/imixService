import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthOptions } from '../../config/auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    // Obtenemos el secreto de la misma forma que en el AuthModule
    const authOptions = configService.get<AuthOptions>('auth');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authOptions?.secret || 'development_secret',
    });
  }

  /**
   * Este método se ejecuta DESPUÉS de que Passport valide la firma del token.
   * Lo que devuelvas aquí se guardará en req.user
   */
  async validate(payload: any) {
    // El 'sub' suele ser el ID del usuario en el estándar JWT
    return { 
      userId: payload.sub, 
      email: payload.email 
    };
  }
}