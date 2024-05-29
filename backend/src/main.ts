import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../seppiaaaaaaaaa-firebase-adminsdk-coa18-7f7550f353.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });

  app.enableCors(); // CORSを有効化
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();
