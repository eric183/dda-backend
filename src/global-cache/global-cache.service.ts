import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

@Injectable()
export class GlobalCacheService implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  // 在模块初始化时调用
  async onModuleInit() {
    // 首次加载数据
    await this.loadAndCacheData();

    // 每7200秒重新加载一次
    setInterval(async () => {
      await this.loadAndCacheData();
    }, 7200 * 1000);
  }

  private async loadAndCacheData() {
    try {
      const data = await this.fetchData();
      await this.cacheManager.set('wx_access_token', data, 7200 * 1000);
    } catch (error) {
      console.error('Failed to load and cache WeChat access token:', error);
    }
  }

  private async fetchData() {
    const appid = this.configService.get<string>('WECHAT_APPID');
    const secret = this.configService.get<string>('WECHAT_SECRET');

    // const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
    const url = `https://api.weixin.qq.com/cgi-bin/stable_token`;
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        appid,
        secret,
        grant_type: 'client_credential',
      }),
    });
    const data = await res.json();
    console.log(data, '......caching');
    if (!res.ok || data.errcode) {
      throw new Error(`Failed to fetch WeChat token: ${JSON.stringify(data)}`);
    }

    return data;
  }

  // ... existing code ...
}
