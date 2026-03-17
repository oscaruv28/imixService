import { Injectable, UnauthorizedException } from '@nestjs/common'; // <-- Agregado UnauthorizedException
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthOptions } from '../config/auth.config'; // Verifica que la ruta sea correcta
import { AuthenticatedUserDto } from './dto/authenticated-user.dto';
import { SignInDto } from './dto/sign-in.dto'; // <-- Agregado SignInDto
import { UserService } from '../users/user.service';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
    private redisClient: Redis;

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {
        // Conexión al Redis de Docker
        this.redisClient = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10)
        });
    }

    // Puedes mantener este método si lo usa el Passport u otro lado, 
    // pero para el login directo usamos signIn
    async validateUser(username: string, password: string): Promise<AuthenticatedUserDto | undefined> {
        const user = await this.userService.findByUsername(username);

        if (user && user.password === password) {
            return { username: user.username };
        }
        return undefined;
    }

    async signIn(signInDto: SignInDto) {
        const { username, password } = signInDto;
        const fullUser = await this.userService.findByUsername(username);

        if (!fullUser || fullUser.password !== password) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // REDIS: Guardamos el perfil financiero
        await this.redisClient.set(
            `user_session:${fullUser.id}`,
            JSON.stringify(fullUser.financialProfile || {}),
            'EX', 86400
        );

        // 4. JWT: PASAMOS EL ID Y EL USERNAME
        const authConfig = this.configService.get<AuthOptions>('auth');

        const token = this.createJwt(fullUser.id, fullUser.username, authConfig?.expiresIn);

        return {
            user: { username: fullUser.username },
            accessToken: token,
        };
    }

    createJwt(userId: string, username: string, expiresIn?: string) {
        return this.jwtService.sign(
            {
                sub: userId,
                username: username
            },
            { expiresIn: (expiresIn || '1d') as any },
        );
    }
}