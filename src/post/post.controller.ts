import { Body, Controller, Get, NotFoundException, Param, Patch, Post, Query } from "@nestjs/common";
import { FirestoreService } from '../common/firestore/firestore.service';
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-posts.dto";

@Controller('post')
export class PostsController {
  constructor(private readonly firestoreService: FirestoreService) {}

  @Get("/")
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
      updatedAt: new Date()
    }

    return this.firestoreService.addDocument('posts', payloadConverted);
  }

  @Patch(":id")
  async updatePost(@Param('id') id: string, @Body() payload: UpdatePostDto) {
    // Ensure the ID is passed and valid
    if (!id) {
      throw new NotFoundException('Post ID is required');
    }

    const payloadConverted = {
      ...payload,
      updatedAt: new Date()
    }

    return this.firestoreService.updateDocumentById('posts', id, payloadConverted);
  }

  @Get(":id")
  async getPost(@Param('id') id: string) {
    if (!id) {
      throw new NotFoundException('Post ID is required');
    }

    return this.firestoreService.getDocumentById('posts', id);
  }
}