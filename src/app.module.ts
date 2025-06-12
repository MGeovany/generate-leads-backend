import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AiModule } from './ai/ai.module';
import { InteractionsModule } from './interactions/interactions.module';
import { TriggersModule } from './triggers/triggers.module';

@Module({
  imports: [AuthModule, UsersModule, AiModule, InteractionsModule, TriggersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
