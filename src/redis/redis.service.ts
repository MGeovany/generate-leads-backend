import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { env } from 'src/config/env';

@Injectable()
export class RedisService {
  getQueue(name: string): Queue {
    return new Queue(name, {
      connection: {
        url: env.REDIS_URL,
      },
    });
  }
}
