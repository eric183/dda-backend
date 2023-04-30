import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DemandsService {
  constructor(private prisma: PrismaService) {}

  async getAllDemands() {
    this.prisma.demand.findMany({
      where: {},
    });
  }

  async createDemandByUser(demand: Prisma.DemandCreateInput) {
    return this.prisma.demand.create({
      data: demand,
    });
  }

  async getSelfDemandsByUserId(userId: number) {
    return this.prisma.demand.findMany({
      where: {
        userId: userId,
      },
    });
  }
}
