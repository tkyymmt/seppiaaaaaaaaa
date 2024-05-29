/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    ClientsModule,
    AuthModule,
  ],
})
export class AppModule { }
