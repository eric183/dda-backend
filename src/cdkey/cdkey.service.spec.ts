import { Test, TestingModule } from '@nestjs/testing';
import { CdkeyService } from './cdkey.service';

describe('CdkeyService', () => {
  let service: CdkeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CdkeyService],
    }).compile();

    service = module.get<CdkeyService>(CdkeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
