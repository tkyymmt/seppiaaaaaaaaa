/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy) {
    async validate(token: string): Promise<string> {
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            return decodedToken.uid;
        } catch (err) {
            throw new UnauthorizedException();
        }
    }
}
