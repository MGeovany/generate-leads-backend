import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestUserLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.user) {
      console.log('🔐 Authenticated user:', req.user);
    } else {
      console.log('🔓 No user in request');
    }
    next();
  }
}
