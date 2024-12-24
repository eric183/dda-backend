// user/user.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { User, Prisma, InviteCode, RoleType } from '@prisma/client';
import { ApiResponseUtil } from 'base/utils/api-response.util';
import { BtUtil } from 'base/utils/bt.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class UserService {
  private readonly SALT_ROUNDS: number = 10; // Default value

  constructor(private readonly prismaService: PrismaService) {}

  onModuleInit() {
    this.checkIfSuperAdminExistsOrCreate();
  }
  // constructor(
  //   private readonly encryptionService: EncryptionService,
  //   private readonly prismaService: PrismaService,
  // ) {}
  async checkIfSuperAdminExistsOrCreate() {
    const superAdmin = await this.prismaService.user.findFirst({
      where: {
        role: 'SUPER_ADMIN',
      },
    });

    if (!superAdmin) {
      console.log('Super admin not found, creating default super admin');
      const defaultSuperAdmin = {
        email: 'kk297466058@gmail.com',
        password: 'Kuangsa183.',
        name: 'kk',
        role: 'SUPER_ADMIN' as RoleType,
      };
      await this.createUser(defaultSuperAdmin);
    }
  }

  async getUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: userWhereUniqueInput,
      // include: { role: true },
    });
  }

  async createInviteCode(
    userId: string,
    metadata?: Record<string, any>,
    expirationDays = 7,
  ): Promise<InviteCode> {
    // Validate user exists
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate unique code with retry logic
    let inviteCode: string;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      inviteCode = uuidv4();
      const existingCode = await this.prismaService.inviteCode.findUnique({
        where: { code: inviteCode },
      });

      if (!existingCode) {
        break;
      }
      attempts++;
    }

    if (attempts === maxAttempts) {
      throw new Error('Failed to generate unique invite code');
    }

    // Calculate expiration date
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);

    // Create invite code with all required fields
    return this.prismaService.inviteCode.create({
      data: {
        code: inviteCode,
        expirationDate,
        userId,
        metadata: metadata || {},
      },
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    // console.log(this.prismaService, 'adskljfdalskjflasdkjflkasdjf');
    const users = await this.prismaService.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    try {
      return ApiResponseUtil.success(
        users,
        'users list retrieved successfully',
      );
    } catch (e) {
      return ApiResponseUtil.error('Failed to retrieve quiz list');
    }
  }

  async createUser(data: Prisma.UserCreateInput) {
    const hashedPassword = await BtUtil.hashPassword(data.password);
    const response = await this.prismaService.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      // include: { role: true },
    });
    try {
      return ApiResponseUtil.success(response, 'User created successfully');
    } catch (e) {
      return ApiResponseUtil.error('Failed to create');
    }
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prismaService.user.update({
      data,
      where,
      // include: { role: true },
    });
  }

  async updateUserPassword(userId: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hashedPassword = await BtUtil.hashPassword(password);

    const updatedUser = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        updatedAt: true,
      },
    });

    try {
      return ApiResponseUtil.success(
        updatedUser,
        'Password updated successfully',
      );
    } catch (e) {
      return ApiResponseUtil.error('Failed to update password');
    }
  }
  // return this.userService.updateUserPassword(id, updateUserPasswordDto.password);

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prismaService.user.delete({
      where,
    });
  }
}
