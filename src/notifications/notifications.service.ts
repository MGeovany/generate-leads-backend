import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async notifyUser(userId: string, message: string) {
    // 🔔 TODO: usar EmailService o integración real en el futuro
    this.logger.log(`[Notify] User ${userId}: ${message}`);
  }
}
