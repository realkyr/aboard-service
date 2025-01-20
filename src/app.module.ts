import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirestoreModule } from "./common/firestore/firestore.module";

@Module({
  imports: [
    FirestoreModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
