import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  FB_CLIENT_ID: z.string(),
  FB_CLIENT_SECRET: z.string(),
  FB_CALLBACK_URL: z.string().url(),

  DATABASE_URL: z.string().url(),

  JWT_SECRET: z.string().min(8),

  OPENAI_API_KEY: z.string().startsWith('sk-'),

  PORT: z.string().refine((val) => !isNaN(Number(val)), {
    message: 'PORT must be a number',
  }),

  NODE_ENV: z.string(),

  REDIS_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
