import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend the Express Request interface to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    sub?: string;
    [key: string]: any;
  };
}

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const start = Date.now();
    const body = { ...req.body };

    res.on('finish', async () => {
      const duration = Date.now() - start;

      try {
        await prisma.requestLog.create({
          data: {
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            body,
            durationMs: duration,
            createdAt: new Date(),
            userId: req.user?.id ?? req.user?.sub ?? null,
          },
        });
      } catch (err) {
        console.error('Failed to log request', err);
      }
    });

    next();
  }
}
