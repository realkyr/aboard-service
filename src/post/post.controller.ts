import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FirestoreService } from '../common/firestore/firestore.service';
import { CreatePostDto } from "./dto/create-post.dto";

@Controller('posts')
export class PostsController {
  constructor(private readonly firestoreService: FirestoreService) {}

  @Get()
  async paginatePosts(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc'
  ) {
    const numericLimit = parseInt(limit, 10) || 10;
    const numericOffset = parseInt(offset, 10) || 0;
    const sortOrderValidated = sortOrder === 'desc' ? 'desc' : 'asc';

    return this.firestoreService.paginateCollection(
      'posts',
      numericLimit,
      numericOffset,
      sortBy,
      sortOrderValidated
    );
  }

  @Post()
  async createPost(@Body() payload: CreatePostDto) {

    const payloadConverted = {
      ...payload,
      createdBy: 'system',
      createdAt: new Date(),
    }

    return this.firestoreService.addDocument('posts', payloadConverted);
  }
}