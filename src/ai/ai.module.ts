import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { InteractionsModule } from '../interactions/interactions.module';

@Module({
  imports: [InteractionsModule],
  providers: [AiService],
  controllers: [AiController]
})
export class AiModule {}
