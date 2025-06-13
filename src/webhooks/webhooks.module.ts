import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { AiModule } from '../ai/ai.module';
import { InteractionsModule } from '../interactions/interactions.module';

@Module({
  imports: [AiModule, InteractionsModule],
  providers: [WebhooksService],
  exports: [WebhooksService],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
