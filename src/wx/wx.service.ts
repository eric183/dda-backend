import { Injectable, Inject } from '@nestjs/common';
import { CreateWxDto } from './dto/create-wx.dto';
import { UpdateWxDto } from './dto/update-wx.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class WxService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  create(createWxDto: CreateWxDto) {
    return 'This action adds a new wx';
  }

  async generateQrCode(tenant: string, width = 430, isHyaline = true, envVersion = "trial") {
    // https://api.weixin.qq.com/wxa/getwxacode   获取小程序码，有数量限制
    // https://api.weixin.qq.com/wxa/getwxacodeunlimit  获取小程序码，无数量限制
    // https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode  获取小程序码二维码，有数量限制

    const { access_token } = (await this.cacheManager.get(
      'wx_access_token',
    )) as { access_token: string };
    const qrType = ['getwxacode', 'getwxacodeunlimit', 'createwxaqrcode'];

    const url = `https://api.weixin.qq.com/wxa/${qrType[0]}?access_token=${access_token}`;
    console.log(url, 'url....');
    const body = {
      method: 'POST',
      body: JSON.stringify({
        // path: `pages/index/index?tenant=${tenant}`,
        // width,
        // path: "pages/index/index",
        // scene: "t=" + tenant,
        // is_hyaline: isHyaline,
        // env_version: envVersion

        width,
        path: "pages/index/index?t=" + tenant,
        is_hyaline: false,
        env_version: "develop"
        // "check_path"\: true,
        // "env_version": "release"
      }),
    };

    const response = await fetch(url, body);

    // 检查响应状态
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`微信API错误: ${JSON.stringify(errorData)}`);
    }

    // 检查返回的内容类型
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      // 如果返回JSON，说明可能是错误信息
      const errorData = await response.json();
      throw new Error(`微信API错误: ${JSON.stringify(errorData)}`);
    }

    const image = await response.arrayBuffer();
    const base64 = Buffer.from(image).toString('base64');
    const data = `data:image/png;base64,${base64}`

    return data;

  }

  async getQrCode(id: number) {
    return 'This action returns a qr code';
  }

  findAll() {
    return `This action returns all wx`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wx`;
  }

  update(id: number, updateWxDto: UpdateWxDto) {
    return `This action updates a #${id} wx`;
  }

  remove(id: number) {
    return `This action removes a #${id} wx`;
  }
}
