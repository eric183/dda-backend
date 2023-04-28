import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HashService } from 'src/hash/hash.service';
// import { PrismaService } from 'src/prisma/prisma.service';

// This should be a real class/interface representing a user entity
export type User = any;
export type Mail = `${string}@${string}.com`;

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
    // private prisma: PrismaService,
    private hashService: HashService,
  ) {}

  userModel = new UserModel();

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.userModel.userInfo.find((user) => user.username === username);
  }

  async getUserByMail(mail: Mail): Promise<User | undefined> {
    return this.userModel.userInfo.find((user) => user.mail === mail);
  }

  async registerUser(createUserDto): Promise<boolean> {
    const createUser = this.userModel.validateUserForm(createUserDto);
    // check if user exists
    const user = await this.getUserByMail(createUser.email as any as Mail);
    if (user) {
      throw new BadRequestException();
    }
    // Hash Password
    createUser.password = await this.hashService.hashPassword(
      createUser.password,
    );

    // this.prisma.user.create({
    //   data: createUser,
    // });

    return this.userModel.create(createUser);
  }
}
