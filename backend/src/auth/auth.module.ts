/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';

@Module({
    imports: [PassportModule],
    providers: [FirebaseAuthStrategy],
})
export class AuthModule { }
