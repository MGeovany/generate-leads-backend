import { Test, TestingModule } from '@nestjs/testing';
import { BlastsController } from './blasts.controller';

describe('BlastsController', () => {
  let controller: BlastsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlastsController],
    }).compile();

    controller = module.get<BlastsController>(BlastsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
