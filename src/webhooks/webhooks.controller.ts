import { Body, Controller, Post } from '@nestjs/common';
import { TestWebhookDto } from './dto/test-webhook.dto';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('test')
  async simulateWebhook(@Body() dto: TestWebhookDto) {
    return this.webhooksService.processSimulatedInteraction(dto);
  }
}
