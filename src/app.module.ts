import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AiModule } from './ai/ai.module';
import { InteractionsModule } from './interactions/interactions.module';
import { TriggersModule } from './triggers/triggers.module';
import { BlastsModule } from './blasts/blasts.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { LogsModule } from './logs/logs.module';
import { RequestUserLoggerMiddleware } from './common/middleware/request-user-logger.middleware';
import { ScheduledModule } from './scheduled/scheduled.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AiModule,
    InteractionsModule,
    TriggersModule,
    BlastsModule,
    WebhooksModule,
    LogsModule,
    ScheduledModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    if (process.env.NODE_ENV !== 'production') {
      consumer
        .apply(RequestUserLoggerMiddleware)
        .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
  }
}
