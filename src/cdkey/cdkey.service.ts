import { Injectable } from '@nestjs/common';
import { CreateCdkeyDto } from './dto/create-cdkey.dto';
import { UpdateCdkeyDto } from './dto/update-cdkey.dto';
import { EncryptionService } from 'src/encryption/encryption.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CdkeyService {
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly prismaService: PrismaService,
  ) {}
  async create(createCdkeyDto: string, STR_LENGTH: number) {
    try {
      const uniqueId =
        this.encryptionService.generateCryptoByLength(STR_LENGTH);
      const linkString = `${uniqueId} :${createCdkeyDto}`;

      const cryptoString = this.encryptionService.encrypt(linkString);

      const result = await this.prismaService.shortLink.create({
        data: {
          slug: uniqueId,
          encryptedData: {
            create: {
              ciphertext: cryptoString,
            },
          },
        },
        include: {
          encryptedData: true,
        },
      });

      return {
        message: 'Cdkey created successfully',
        slug: result.slug,
        encryptedDataId: result.encryptedData.id,
      };
    } catch (error) {
      console.error('Error creating cdkey:', error);
      return `Failed to create cdkey:  ${error.message}`;
    }
  }

  async createMany(slug: string, count: number, STR_LENGTH: number) {
    try {
      const shortLinks = await this.prismaService.shortLink.createMany({
        // const shortLinks = await this.prismaService.shortLink.createMany({
        data: Array.from({ length: count }, () => ({
          slug: this.encryptionService.generateCryptoByLength(STR_LENGTH),
        })),
      });

      // 获取刚创建的 ShortLinks
      const createdShortLinks = await this.prismaService.shortLink.findMany({
        take: shortLinks.count,
        orderBy: { createdAt: 'desc' },
      });

      // 为每个 ShortLink 创建 EncryptedData
      const encryptedDataPromises = createdShortLinks.map((link) =>
        this.prismaService.encryptedData.create({
          data: {
            ciphertext: this.encryptionService.encrypt(`${link.slug}:${slug}`),
            shortLink: {
              connect: {
                id: link.id,
              },
            },
          },
        }),
      );

      await Promise.all(encryptedDataPromises);

      return { created: shortLinks.count, links: createdShortLinks };
    } catch (error) {
      console.error('Error creating cdkey:', error);
      return `Failed to create cdkey:  ${error.message}`;
    }
  }

  findAll() {
    return `This action returns all cdkey`;
  }

  async findOne(slug: string) {
    // return this.encryptionService.encrypt(id);
  }

  async checkOne(slug: string) {
    const encryptedData = await this.prismaService.encryptedData.findUnique({
      where: {
        slug,
      },
    });

    if (!encryptedData) {
      return '数据不存在';
    }

    return `${slug}-${this.encryptionService
      .decrypt(encryptedData.ciphertext)
      .split(':')
      .pop()}`;
  }

  remove(id: number) {
    return `This action removes a #${id} cdkey`;
  }
}
