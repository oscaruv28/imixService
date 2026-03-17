import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CreditRequest } from './credit-request.entity';
import { CreditsService } from './credits.service';
import { CreditsController } from './credits.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([CreditRequest]),
    AuthModule,
  ],
  controllers: [CreditsController],
  providers: [CreditsService],
  exports: [CreditsService],
})
export class CreditsModule {}