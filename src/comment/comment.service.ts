import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../common/firestore/firestore.service';
import { MeilisearchService } from '../common/meilisearch/meilisearch.service';
import { CommentPayload } from '../types';
import { Pagination } from '@shared-types/pagination';

@Injectable()
export class CommentService {
  private readonly collection = 'comments';

  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly meilisearchService: MeilisearchService,
  ) {}

  async create(postId: string, data: CommentPayload) {
    const savedComment = await this.firestoreService.addDocument(
      this.collection,
      data,
    );

    delete savedComment.post;

    await this.meilisearchService.addDocuments('comments', [
      {
        ...savedComment,
        postId,
        createdAt: data.createdAt.toISOString(),
        updatedAt: data.updatedAt.toISOString(),
        id: savedComment.id,
      },
    ]);

    return savedComment;
  }

  async getPaginatedComments(
    postId: string,
    limit: number,
    page: number,
    sortBy?: string,
    orderBy: 'asc' | 'desc' = 'asc',
  ): Promise<{ data: any[]; pagination: Pagination }> {
    const query = ''; // Empty query to fetch all results matching the filter
    const filters = `postId = ${postId}`;

    const result = await this.meilisearchService.getPaginatedResults(
      'comments',
      query,
      {
        limit,
        page,
        sortBy,
        orderBy,
        filters,
      },
    );

    return {
      data: result.hits,
      pagination: {
        total: result.totalHits,
        limit,
        page,
      },
    };
  }

  async update(commentId: string, data: Partial<CommentPayload>) {
    await this.firestoreService.updateDocumentById(this.collection, commentId, {
      ...data,
    });

    await this.meilisearchService.updateDocument('comments', {
      id: commentId,
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return { id: commentId, ...data };
  }

  async delete(commentId: string) {
    await this.firestoreService.deleteById(this.collection, commentId);

    await this.meilisearchService.deleteDocument('comments', commentId);
    return { message: 'Comment deleted successfully', id: commentId };
  }

  async deleteCommentsByPostId(postId: string) {
    await this.firestoreService.deleteDocumentsByQuery(this.collection, [
      {
        field: 'postId',
        opStr: '==',
        value: postId,
      },
    ]);
  }
}
