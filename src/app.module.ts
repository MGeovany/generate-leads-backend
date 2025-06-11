import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AiModule } from './ai/ai.module';
import { InteractionsModule } from './interactions/interactions.module';

@Module({
  imports: [AuthModule, UsersModule, AiModule, InteractionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
