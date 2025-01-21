import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as credential from './config/service-account.json';
import * as admin from 'firebase-admin';
import { ServiceAccount } from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(credential as ServiceAccount)
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
}
bootstrap();
