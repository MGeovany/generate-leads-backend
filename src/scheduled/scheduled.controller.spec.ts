import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledController } from './scheduled.controller';

describe('ScheduledController', () => {
  let controller: ScheduledController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduledController],
    }).compile();

    controller = module.get<ScheduledController>(ScheduledController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
