import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirestoreModule } from './common/firestore/firestore.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [FirestoreModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
