import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class CommonResponse<T> {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data?: T;

  constructor(statusCode: HttpStatus, message: string, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}