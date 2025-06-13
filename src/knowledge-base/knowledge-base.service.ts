import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class KnowledgeBaseService {
  async processUpload(file: Express.Multer.File, userId: string) {
    const ext = path.extname(file.originalname);

    if (ext === '.json') {
      const raw = fs.readFileSync(file.path, 'utf-8');
      const data = JSON.parse(raw);

      if (data.messages) {
        const examples = data.messages
          .filter((m) => m.sender_name && m.content)
          .map((m) => `From ${m.sender_name}: ${m.content}`)
          .slice(0, 100);

        const content = examples.join('\n\n');

        await prisma.knowledgeBase.create({
          data: {
            userId,
            title: file.originalname,
            content,
          },
        });

        return { message: 'Instagram chat uploaded and parsed successfully.' };
      }

      return { message: 'Unsupported JSON format.' };
    }

    return { message: 'Unsupported file type.' };
  }

  async getTopExamplesForUser(
    userId: string,
  ): Promise<{ input: string; output: string }[]> {
    const entries = await prisma.knowledgeBase.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    return entries.flatMap((entry) => {
      const lines = entry.content.split('\n').filter((l) => l.includes(': '));
      return lines.map((line) => {
        const [input, output] = line.split(': ').map((s) => s.trim());
        return { input, output };
      });
    });
  }
}
