import { Module } from '@nestjs/common';
import { PostsController } from './post.controller';
import { PostService } from './post.service';
import { CommentService } from '../comment/comment.service';

@Module({
  imports: [],
  controllers: [PostsController],
  providers: [PostService, CommentService],
})
export class PostModule {}
