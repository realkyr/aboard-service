import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FirestoreService } from '../common/firestore/firestore.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-posts.dto';
import { PostDocument } from '../types';
import { MeilisearchService } from '../common/meilisearch/meilisearch.service';
import { Pagination } from '@shared-types/pagination';
import { PostType } from '@shared-types/post';
import { PostService } from './post.service';

@Controller('post')
export class PostsController {
  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly meilisearchService: MeilisearchService,
    private readonly postService: PostService,
  ) {}

  @Get()
  async getPosts(
    @Query('query') query: string = '',
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('sortBy') sortBy?: string,
    @Query('orderBy') orderBy: 'asc' | 'desc' = 'asc',
    @Query('community') community?: string,
    @Query('createdBy') createdBy?: string,
  ): Promise<{
    pagination: Pagination;
    data: PostType[];
  }> {
    return this.postService.getPosts(
      query,
      limit,
      offset,
      sortBy,
      orderBy,
      community,
      createdBy,
    );
  }

  @Post()
  async createPost(@Body() payload: CreatePostDto) {
    const payloadConverted = {
      ...payload,
      createdBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.firestoreService.addDocument(
      'posts',
      payloadConverted,
    );

    await this.meilisearchService.addDocumentWithSubstrings(
      'posts',

      {
        ...payloadConverted,
        id: result.id,
      },
      'topic',
    );

    return result;
  }

  @Patch(':id')
  async updatePost(@Param('id') id: string, @Body() payload: UpdatePostDto) {
    // Ensure the ID is passed and valid
    if (!id) {
      throw new NotFoundException('Post ID is required');
    }

    const payloadConverted = {
      ...payload,
      updatedAt: new Date(),
    };

    const result = await this.firestoreService.updateDocumentById(
      'posts',
      id,
      payloadConverted,
    );

    await this.meilisearchService.updateDocument('posts', {
      ...payloadConverted,
      id,
    });

    return result;
  }

  @Get(':id')
  async getPost(@Param('id') id: string): Promise<PostDocument> {
    if (!id) {
      throw new NotFoundException('Post ID is required');
    }

    return this.firestoreService.getDocumentById('posts', id);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    if (!id) {
      throw new NotFoundException('Post ID is required');
    }

    return this.postService.deletePost(id);
  }
}
