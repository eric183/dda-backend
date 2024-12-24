// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

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
