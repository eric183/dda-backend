import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import e from 'express';
import { HashService } from 'src/hash/hash.service';
import { PrismaService } from 'src/prisma/prisma.service';
// import { PrismaService } from 'src/prisma/prisma.service';

// This should be a real class/interface representing a user entity
export type Email = string;

export type TUser = {
  email: Email;
  password: string;
};

class UserModel {
  userInfo: any[];
  constructor() {
    this.userInfo = [
      {
        userId: 1,
        username: 'john',
        password: 'changeme',
        mail: 'kk297466058@gmail.com',
      },
      {
        userId: 2,
        username: 'maria',
        password: 'guess',
        mail: '297466058@qq.com',
      },
    ];
  }

  validateUserForm(data: Prisma.UserCreateInput) {
    if (true) {
      return data;
    }
  }

  create(userInfo) {
    const _userInfo = this.validateUserForm({
      userId: this.userInfo.length + 1,
      ...userInfo,
    });

    this.userInfo.push(_userInfo);

    return true;
  }
}

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private hashService: HashService,
  ) {}

  userModel = new UserModel();

  async getALLUsers() {
    return await this.prisma.user.findMany();
  }

  async getUserbyId(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async getUserByUsername(username: string): Promise<TUser | undefined> {
    return this.userModel.userInfo.find((user) => user.username === username);
  }

  async getUserByMail(email: Email): Promise<TUser | undefined> {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        email: true,
        password: true,
        id: true,
      },
    });
  }

  async registerUser(createUser): Promise<boolean | TUser> {
    // const createUser = this.userModel.validateUserForm(createUserDto);
    // check if user exists
    console.log(createUser, '...sadf');

    const user = await this.getUserByMail(createUser.email as any as Email);

    if (user) {
      console.log('已经存在的用户');
      return user;

      throw new BadRequestException();
    }

    // console.log(user, '.......user');
    // this.hashService.hashPassword
    // Hash Password
    console.log(createUser.password, '!!!');
    createUser.password = await this.hashService.hashPassword(
      createUser.password,
    );

    const prismaResponse = await this.prisma.user.create({
      data: createUser,
    });

    console.log(prismaResponse, '33333');
    return this.userModel.create(createUser);
  }
}
