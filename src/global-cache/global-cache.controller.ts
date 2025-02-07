import { Controller } from '@nestjs/common';
import { GlobalCacheService } from './global-cache.service';

@Controller('global-cache')
export class GlobalCacheController {
  constructor(private readonly globalCacheService: GlobalCacheService) {}
}
