import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentPayload } from '../types';
import { FirestoreService } from '../common/firestore/firestore.service';
import { ValidateUsernameGuard } from '../common/guard/validate-username.guard';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly firestoreService: FirestoreService,
  ) {}

  @Post(':postId')
  @UseGuards(ValidateUsernameGuard)
  async create(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: { username: string },
  ) {
    const commentPayload: CommentPayload = {
      ...createCommentDto,
      createdAt: new Date(),
      updatedAt: new Date(),
      post: this.firestoreService.createReferenceByID('posts', postId),
      author: req.username,
    };

    const result = await this.commentService.create(postId, commentPayload);

    console.log({ result });

    return result;
  }

  @Get(':postId')
  async getPaginatedComments(
    @Param('postId') postId: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Query('sortBy') sortBy?: string,
    @Query('orderBy') orderBy: 'asc' | 'desc' = 'asc',
  ) {
    const limitNumber = parseInt(limit, 10) || 0; // Default to 0
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
  @UseGuards(ValidateUsernameGuard)
  async update(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(commentId, updateCommentDto);
  }

  @Delete(':commentId')
  @UseGuards(ValidateUsernameGuard)
  async delete(@Param('commentId') commentId: string) {
    return this.commentService.delete(commentId);
  }
}
