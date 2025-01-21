import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirestoreModule } from './common/firestore/firestore.module';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';
import { MeilisearchModule } from './common/meilisearch/meilisearch.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirestoreModule,
    PostModule,
    CommentModule,
    MeilisearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
