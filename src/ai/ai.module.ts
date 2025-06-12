import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { InteractionsModule } from '../interactions/interactions.module';
import { TriggersModule } from '../triggers/triggers.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [InteractionsModule, TriggersModule, UsersModule],
  providers: [AiService],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}
