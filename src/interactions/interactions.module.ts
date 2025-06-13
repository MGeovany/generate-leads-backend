import { Module, forwardRef } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { InteractionsController } from './interactions.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [forwardRef(() => AiModule)],
  providers: [InteractionsService],
  exports: [InteractionsService],
  controllers: [InteractionsController],
})
export class InteractionsModule {}
