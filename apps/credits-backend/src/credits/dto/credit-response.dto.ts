import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { CommonResponse } from 'src/core/api-response.model';

export class CreditDataDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  amount: number;

  @ApiProperty()
  @Expose()
  applicantId: string;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty({ required: false })
  @Expose()
  aiScore?: number;

  @ApiProperty({ required: false })
  @Expose()
  aiAnalysis?: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  // Este es el método que usa el controlador para limpiar la entidad de la BD
  static fromEntity(entity: any): CreditDataDto {
    return plainToInstance(CreditDataDto, entity, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}

// En el estilo Vlesim, las clases de respuesta extienden de CommonResponse
export class CreateCreditResponseDto extends CommonResponse<CreditDataDto> {
  @ApiProperty({ type: CreditDataDto })
  data: CreditDataDto;

  constructor(statusCode: number, message: string, data: CreditDataDto) {
    super(statusCode, message, data);
  }
}

export class ListCreditsResponseDto extends CommonResponse<CreditDataDto[]> {
  @ApiProperty({ type: [CreditDataDto] })
  data: CreditDataDto[];

  constructor(statusCode: number, message: string, data: CreditDataDto[]) {
    super(statusCode, message, data);
  }
}