import { Injectable } from '@nestjs/common';
import { Client } from './client.entity';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async createClient(data: Prisma.ClientsCreateInput): Promise<Client> {
    return this.prisma.clients.create({ data });
  }

  async findAll(): Promise<Client[]> {
    return this.prisma.clients.findMany();
  }
}