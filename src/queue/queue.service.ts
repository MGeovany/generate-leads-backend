import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { config } from 'dotenv';
import { env } from 'src/config/env';

config();

@Injectable()
export class QueueService implements OnModuleInit {
  blastQueue: Queue;

  onModuleInit() {
    this.blastQueue = new Queue('blast', {
      connection: {
        host: env.REDIS_HOST || 'localhost',
        port: Number(env.REDIS_PORT) || 6379,
      },
    });
  }

  async enqueueBlast(target: { targetId: string; message: string }) {
    await this.blastQueue.add('send-blast', target, {
      delay: Math.floor(Math.random() * 3000) + 2000, // 2-5 sec delay
      attempts: 2,
    });
  }
}
