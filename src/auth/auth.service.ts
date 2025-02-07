// auth/auth.service.ts
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prisma: PrismaService,
    private jwtService: JwtService, // @Inject(CACHE_MANAGER) // private cacheManager: Cache,
  ) {}

  async onModuleInit() {
    // // 初始化时获取token
    await this.getAndCacheAccessToken();

    // 设置定时任务，每7200秒刷新一次
    setInterval(async () => {
      await this.getAndCacheAccessToken();
    }, 7200 * 1000);
  }

  private async getAndCacheAccessToken() {
    // const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
    // const res = await fetch(url);
    // const data = await res.json();
    // // 将access_token存入缓存
    // await this.cacheManager.set('wx_access_token', data.access_token, 7200);
    await this.cacheManager.set(
      'wx_access_token',
      {
        access_token: '123',
        expires_in: 7200,
      },
      7200,
    );
  }

  async validateUser(email: string, password: string): Promise<any> {
    if (!email) {
      throw new Error('Email is required for user validation');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
      // include: { role: true },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      console.log('result', result);
      return result;
    }
    return null;
  }

  async login(user: User) {
    // 更新最后登录时间
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload = {
      email: user.email,
      sub: user.id,
      // role: user.roleId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        // role: user.roleId,
      },
    };
  }

  // async register(userData: { email: string; password: string; name?: string }) {
  //   const hashedPassword = await bcrypt.hash(userData.password, 10);

  //   // 获取默认用户角色
  //   const defaultRole = await this.prisma.role.findUnique({
  //     where: {},
  //   });

  //   if (!defaultRole) {
  //     throw new Error('Default role not found');
  //   }

  //   const newUser = await this.prisma.user.create({
  //     data: {
  //       email: userData.email,
  //       password: hashedPassword,
  //       name: userData.name,
  //       // roleId: defaultRole.id,
  //     },
  //     // include: { role: true },
  //   });

  //   const { password, ...result } = newUser;
  //   return result;
  // }
}
