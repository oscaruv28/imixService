import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateCreditDto {
  @ApiProperty({ 
    description: 'Monto de dinero solicitado para el crédito', 
    example: 2500000 
  })
  @IsNumber({}, { message: 'El monto debe ser un número válido' })
  @Min(100000, { message: 'El monto mínimo a solicitar es 100,000' })
  @IsNotEmpty({ message: 'El monto es obligatorio' })
  amount: number;

  @ApiProperty({ 
    description: 'ID único del cliente o tendero que solicita el crédito', 
    example: '65f4a1b2c3d4e5f6' 
  })
  @IsString({ message: 'El ID del solicitante debe ser una cadena de texto' })
  @IsOptional()
  applicantId: string;
}