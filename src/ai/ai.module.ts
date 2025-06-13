import { Module, forwardRef } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { TriggersModule } from '../triggers/triggers.module';
import { UsersModule } from '../users/users.module';
import { InteractionsModule } from '../interactions/interactions.module';

@Module({
  imports: [TriggersModule, UsersModule, forwardRef(() => InteractionsModule)],
  providers: [AiService],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}
