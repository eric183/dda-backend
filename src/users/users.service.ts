import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import e from 'express';
import { HashService } from 'src/hash/hash.service';
import { PrismaService } from 'src/prisma/prisma.service';
// import { PrismaService } from 'src/prisma/prisma.service';

// This should be a real class/interface representing a user entity
export type Email = string;

export type TUser = {
  id?: string;
  email: Email;
  password: string;
  username?: string;
};

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private hashService: HashService,
  ) {}

  async getALLUsers() {
    return await this.prisma.user.findMany();
  }

  async getUserbyId(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        email: true,
        id: true,
        username: true,
        avatar: true,
      },
    });
  }

  async getUserByMail(email: Email): Promise<TUser | undefined> {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        username: true,
        email: true,
        password: true,
        id: true,
      },
    });
  }

  async registerUser(createUser): Promise<boolean | TUser> {
    const user = await this.getUserByMail(createUser.email as any as Email);

    if (user) {
      console.log('已经存在的用户');
      return user;

      throw new BadRequestException();
    }

    console.log(createUser.password, '!!!');
    createUser.password = await this.hashService.hashPassword(
      createUser.password,
    );

    const prismaResponse = await this.prisma.user.create({
      data: {
        ...createUser,
        // contacts: [],
        matchedDemands: [],
      },
    });

    if (prismaResponse) {
      return true;
    }
  }

  async updateUserName(userId, user): Promise<boolean> {
    const username = user.username;
    const prismaResponse = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username,
      },
    });
    if (prismaResponse) {
      return true;
    }
  }

  async updateUserAvatar(userId, user): Promise<boolean> {
    const avatar = user.avatar;

    const prismaResponse = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatar,
      },
    });
    if (prismaResponse) {
      return true;
    }
  }

  async updateUserContact(userId, toUserId) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        contacts: {
          connect: {
            userId: toUserId,
          },
        },
      },
    });
  }

  async resetPWD(userId, user): Promise<boolean> {
    const password = await this.hashService.hashPassword(user.password);
    const prismaResponse = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password,
      },
    });

    console.log(prismaResponse, '...password');
    return true;
  }
}
