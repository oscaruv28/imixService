import { Controller, Post, Get, Body, HttpStatus, Logger, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreditsService } from './credits.service';
import { CreateCreditDto } from './dto/create-credit.dto';
import { CreditDataDto, CreateCreditResponseDto, ListCreditsResponseDto } from './dto/credit-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('credits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@ApiBadRequestResponse({ description: 'Bad request' })
@Controller('credits')
export class CreditsController {
  private readonly logger = new Logger(CreditsController.name);

  constructor(private readonly creditsService: CreditsService) {}

  @ApiCreatedResponse({
    description: 'Credit request created and processing',
    type: CreateCreditResponseDto,
  })
  @Post('request')
  @ApiOperation({ summary: 'Crear nueva solicitud de micro-crédito' })
  async create(@Body() createCreditDto: CreateCreditDto, @Request() req: any) {
    const applicantId = req.user.userId;
    
    this.logger.debug(`Creating credit request for user: ${applicantId}`);

    const creditRequest = await this.creditsService.create(
      createCreditDto.amount,
      applicantId,
    );

    return new CreateCreditResponseDto(
      HttpStatus.CREATED,
      'Credit request received and sent to AI processing',
      CreditDataDto.fromEntity(creditRequest),
    );
  }

  @ApiOkResponse({
    description: 'Credit history retrieved successfully',
    type: ListCreditsResponseDto,
  })
  @Get('history')
  @ApiOperation({ summary: 'Ver historial de créditos procesados por IA' })
  async getHistory() {
    this.logger.debug('Retrieving all credit requests');

    const history = await this.creditsService.findAll();

    return new ListCreditsResponseDto(
      HttpStatus.OK,
      'List of credit requests retrieved successfully',
      history.map(CreditDataDto.fromEntity),
    );
  }
}