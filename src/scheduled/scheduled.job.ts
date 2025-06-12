import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ScheduledService } from './scheduled.service';

@Injectable()
export class ScheduledJob {
  private readonly logger = new Logger(ScheduledJob.name);

  constructor(private scheduledService: ScheduledService) {}

  @Cron('*/1 * * * *')
  async handleScheduledMessages() {
    const messages = await this.scheduledService.getPendingMessages();

    for (const msg of messages) {
      try {
        this.logger.log(
          `📤 Sending message to ${msg.targetId}: ${msg.message}`,
        );
        await this.scheduledService.markAsSent(msg.id);
      } catch (e) {
        this.logger.error(`❌ Failed to send message ${msg.id}`, e.message);
        await this.scheduledService.markAsFailed(msg.id);
      }
    }
  }
}
