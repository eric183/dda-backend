import { Injectable } from '@nestjs/common';
import { DemandStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { omit } from 'lodash';

@Injectable()
export class DemandsService {
  constructor(private prisma: PrismaService) {}

  async getAllDemands() {
    return this.prisma.demand.findMany({
      include: {
        User: true,
        place: true,
      },
    });
  }

  async createDemandByUser(
    demand: Prisma.DemandCreateInput & { userId: string } & {
      place: {
        latitude: number;
        longitude: number;
        name: string;
      };
    },
  ) {
    console.log(demand, '.,..');
    return this.prisma.demand.create({
      data: {
        ...omit(demand, ['userId', 'place']),
        User: {
          connect: {
            id: demand.userId,
          },
        },
        place: {
          connectOrCreate: {
            where: {
              name: demand.place.name,
            },
            create: {
              latitude: demand.place.latitude,
              longitude: demand.place.longitude,
              name: demand.place.name,
            },
          },
        },
      },
    });
  }

  async getSelfDemandCountByUserId(userId: string) {
    return this.prisma.demand.count({
      where: {
        userId: userId,
      },
    });
  }

  async getSelfDemandsByUserId(userId: string) {
    return this.prisma.demand.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async updateDemandStatus(id: string, updateDemandStatus: DemandStatus) {
    const demand = await this.prisma.demand.update({
      where: {
        id,
      },
      data: {
        status: updateDemandStatus,
      },
    });
    console.log(demand, '!!!');
    return {
      ...demand,
      status: updateDemandStatus,
    };
    // return this.prisma.demand.findMany({
    //   where: {
    //     userId: userId,
    //   },
    // });
  }
}
