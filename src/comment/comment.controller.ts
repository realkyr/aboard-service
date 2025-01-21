import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Query,
  Patch,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentPayload } from '../types';
import { FirestoreService } from '../common/firestore/firestore.service';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly firestoreService: FirestoreService,
  ) {}

  @Post(':postId')
  async create(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const commentPayload: CommentPayload = {
      ...createCommentDto,
      createdAt: new Date(),
      updatedAt: new Date(),
      post: this.firestoreService.createReferenceByID('posts', postId),
      author: 'system',
    };

    return this.commentService.create(postId, commentPayload);
  }

  @Get(':postId')
  async getPaginatedComments(
    @Param('postId') postId: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Query('sortBy') sortBy?: string,
    @Query('orderBy') orderBy: 'asc' | 'desc' = 'asc',
  ) {
    const limitNumber = parseInt(limit, 10) || 10; // Default to 10
    const pageNumber = parseInt(page, 10) || 0; // Default to 0

    return this.commentService.getPaginatedComments(
      postId,
      limitNumber,
      pageNumber,
      sortBy,
      orderBy,
    );
  }

  @Patch(':commentId')
  async update(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(commentId, updateCommentDto);
  }

  @Delete(':commentId')
  async delete(@Param('commentId') commentId: string) {
    return this.commentService.delete(commentId);
  }
}
