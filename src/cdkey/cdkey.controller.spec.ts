import { Test, TestingModule } from '@nestjs/testing';
import { CdkeyController } from './cdkey.controller';
import { CdkeyService } from './cdkey.service';

describe('CdkeyController', () => {
  let controller: CdkeyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CdkeyController],
      providers: [CdkeyService],
    }).compile();

    controller = module.get<CdkeyController>(CdkeyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
