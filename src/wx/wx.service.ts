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

  async generateQrCode(tenant: string, width = 430) {
    // https://api.weixin.qq.com/wxa/getwxacode   获取小程序码，有数量限制
    // https://api.weixin.qq.com/wxa/getwxacodeunlimit  获取小程序码，无数量限制
    // https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode  获取小程序码二维码，有数量限制

    const { access_token } = (await this.cacheManager.get(
      'wx_access_token',
    )) as { access_token: string };
    const qrType = ['getwxacode', 'getwxacodeunlimit', 'createwxaqrcode'];

    const url = `https://api.weixin.qq.com/wxa/${qrType[1]}?access_token=${access_token}`;
    console.log(url, 'url....');
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        path: `pages/index/index?tenant=${tenant}`,
        width,
      }),
    });
    const data = await response.json();
    console.log(data);
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
