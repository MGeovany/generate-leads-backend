import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  providers: [WebhooksService],
  exports: [WebhooksService],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
