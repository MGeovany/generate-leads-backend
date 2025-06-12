import { Test, TestingModule } from '@nestjs/testing';
import { BlastsService } from './blasts.service';

describe('BlastsService', () => {
  let service: BlastsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlastsService],
    }).compile();

    service = module.get<BlastsService>(BlastsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
