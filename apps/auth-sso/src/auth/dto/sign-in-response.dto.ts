import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Type } from 'class-transformer';
import { CommonResponse } from 'src/core/api-response.model';
import { AuthenticatedUserDto } from './authenticated-user.dto';

export class AuthenticatedUserResponseDto {
  @ApiProperty()
  @Type(() => AuthenticatedUserDto)
  @Expose()
  user: AuthenticatedUserDto;

  @ApiProperty()
  @Expose()
  accessToken: string;

  /**
   * Transforma los datos crudos al formato del DTO 
   * aplicando las reglas de @Expose()
   */
  static create(
    user: AuthenticatedUserDto,
    accessToken: string,
  ): AuthenticatedUserResponseDto {
    return plainToInstance(
      AuthenticatedUserResponseDto,
      { user, accessToken },
      {
        excludeExtraneousValues: true, // Ignora todo lo que no tenga @Expose
        exposeUnsetFields: false,
      },
    );
  }
}

export class SignInResponseDto extends CommonResponse<AuthenticatedUserResponseDto> {
  @ApiProperty({ type: AuthenticatedUserResponseDto })
  data: AuthenticatedUserResponseDto;
}