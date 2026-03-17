import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponseDto, AuthenticatedUserResponseDto } from './dto/sign-in-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOkResponse({ type: SignInResponseDto })
    @ApiBody({ type: SignInDto })
    async login(@Body() signInDto: SignInDto) {
        const { user, accessToken } = await this.authService.signIn(signInDto);
        return new SignInResponseDto(
            HttpStatus.OK,
            'User signed in successfully',
            AuthenticatedUserResponseDto.create(user, accessToken),
        );
    }
}