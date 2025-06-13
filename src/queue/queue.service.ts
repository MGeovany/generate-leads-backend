import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class QueueService implements OnModuleInit {
  blastQueue: Queue;

  constructor(private readonly redisService: RedisService) {}

  onModuleInit() {
    this.blastQueue = this.redisService.getQueue('blast');
  }

  async enqueueBlast(target: { targetId: string; message: string }) {
    await this.blastQueue.add('send-blast', target, {
      delay: Math.floor(Math.random() * 3000) + 2000,
      attempts: 2,
    });
  }
}
