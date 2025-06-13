import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { KnowledgeBaseService } from './knowledge-base.service';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('knowledge-base')
@UseGuards(JwtAuthGuard)
export class KnowledgeBaseController {
  constructor(private readonly kbService: KnowledgeBaseService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const ext = path.extname(file.originalname);
          const name = `${Date.now()}${ext}`;
          cb(null, name);
        },
      }),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const userId = req.user.userId;
    return this.kbService.processUpload(file, userId);
  }
}
