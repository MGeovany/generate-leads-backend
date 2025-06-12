import { Module } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { InteractionsController } from './interactions.controller';

@Module({
  providers: [InteractionsService],
  exports: [InteractionsService],
  controllers: [InteractionsController],
})
export class InteractionsModule {}
