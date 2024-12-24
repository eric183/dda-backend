import { Test, TestingModule } from '@nestjs/testing';
import { BusinessUserController } from './business-user.controller';
import { BusinessUserService } from './business-user.service';

describe('BusinessUserController', () => {
  let controller: BusinessUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessUserController],
      providers: [BusinessUserService],
    }).compile();

    controller = module.get<BusinessUserController>(BusinessUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
