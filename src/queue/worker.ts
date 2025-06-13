import { Worker } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { env } from 'src/config/env';

const prisma = new PrismaClient();

const worker = new Worker(
  'blast',
  async (job) => {
    const { targetId, message } = job.data;
    console.log(`📤 Simulating message: "${message}" to target ${targetId}`);

    const success = Math.random() > 0.05;

    await prisma.blastTarget.update({
      where: { id: targetId },
      data: {
        status: success ? 'sent' : 'failed',
      },
    });
  },
  {
    connection: {
      url: env.REDIS_URL,
    },
  },
);

console.log('🟢 Blast worker running...');
