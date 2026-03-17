import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthenticatedUserDto {
  @ApiProperty()
  @Expose()
  readonly username: string;
}
