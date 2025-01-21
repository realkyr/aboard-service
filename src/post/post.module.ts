import { Module } from '@nestjs/common';
import { PostsController } from './post.controller';

@Module({
  imports: [],
  controllers: [PostsController],
  providers: [],
})
export class PostModule {}
