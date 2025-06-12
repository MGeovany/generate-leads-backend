import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { InteractionsModule } from '../interactions/interactions.module';
import { TriggersModule } from '../triggers/triggers.module';

@Module({
  imports: [InteractionsModule, TriggersModule],
  providers: [AiService],
  controllers: [AiController]
})
export class AiModule {}
