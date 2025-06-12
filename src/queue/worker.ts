import { Worker } from 'bullmq';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const worker = new Worker(
  'blast',
  async (job) => {
    const { targetId, message } = job.data;

    console.log(`📤 Simulating message: "${message}" to target ${targetId}`);

    // Simulate success/failure
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
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  },
);

console.log('🟢 Blast worker running...');
