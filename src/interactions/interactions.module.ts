import { Module } from '@nestjs/common';
import { InteractionsService } from './interactions.service';

@Module({
  providers: [InteractionsService],
})
export class InteractionsModule {}
