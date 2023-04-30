import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { omit } from 'lodash';

@Injectable()
export class DemandsService {
  constructor(private prisma: PrismaService) {}

  async getAllDemands() {
    return this.prisma.demand.findMany();
  }

  async createDemandByUser(
    demand: Prisma.DemandCreateInput & { userId: number },
  ) {
    console.log(demand, '.,..');
    return this.prisma.demand.create({
      data: {
        ...omit(demand, 'userId'),
        User: {
          connect: {
            id: demand.userId,
          },
        },
      },
    });
  }

  async getSelfDemandCountByUserId(userId: number) {
    return this.prisma.demand.count({
      where: {
        userId: userId,
      },
    });
  }

  async getSelfDemandsByUserId(userId: number) {
    return this.prisma.demand.findMany({
      where: {
        userId: Number(userId),
      },
    });
  }
}
