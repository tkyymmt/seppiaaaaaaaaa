/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) { }

  async getClientsByIdsAndUserId(clientIds: number[], uid: string) {
    return this.prisma.client.findMany({
      where: {
        id: { in: clientIds },
        uid: uid,
      },
    });
  }

  async getCategoriesByIdsAndUserId(categoryIds: number[], uid: string) {
    return this.prisma.category.findMany({
      where: {
        id: { in: categoryIds },
        uid: uid,
      },
    });
  }

  async linkClientsToCategories(clientIds: number[], categoryIds: number[]): Promise<void> {
    const operations = clientIds.map(clientId =>
      this.prisma.client.update({
        where: { id: clientId },
        data: {
          categories: {
            connect: categoryIds.map(id => ({ id })),
          },
        },
      }),
    );
    await this.prisma.$transaction(operations);
  }

  async unlinkClientsFromCategories(clientIds: number[], categoryIds: number[]): Promise<void> {
    const operations = clientIds.map(clientId =>
      this.prisma.client.update({
        where: { id: clientId },
        data: {
          categories: {
            disconnect: categoryIds.map(id => ({ id })),
          },
        },
      }),
    );
    await this.prisma.$transaction(operations);
  }

}
