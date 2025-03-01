import { MeilisearchService } from '../common/meilisearch/meilisearch.service';
import { Pagination } from '@shared-types/pagination';
import { PostType } from '@shared-types/post';
import { Injectable } from '@nestjs/common';
import { MeilisearchResult } from './types';
import dayjs from 'dayjs';
import { FirestoreService } from '../common/firestore/firestore.service';
import { CommentService } from '../comment/comment.service';

@Injectable()
export class PostService {
  constructor(
    private readonly meilisearchService: MeilisearchService,
    private readonly firestoreService: FirestoreService,
    private readonly commentService: CommentService,
  ) {}

  async getPosts(
    query: string = '',
    limit?: string,
    page?: string,
    sortBy?: string,
    orderBy: 'asc' | 'desc' = 'asc',
    community?: string,
    createdBy?: string,
  ): Promise<{
    pagination: Pagination;
    data: PostType[];
  }> {
    // Convert and validate limit and offset
    const limitNumber = parseInt(limit, 10) || 10;
    const pageNumber = parseInt(page, 10) || 0;

    const filtersArray: string[] = [];

    if (community) {
      filtersArray.push(`community = "${community}"`);
    }

    if (createdBy) {
      filtersArray.push(`createdBy = "${createdBy}"`);
    }

    // Fetch results from Meilisearch
    const results: MeilisearchResult =
      (await this.meilisearchService.getPaginatedResults('posts', query, {
        limit: limitNumber,
        page: pageNumber,
        sortBy,
        orderBy,
        filters: filtersArray.join(' AND '),
      })) as unknown as MeilisearchResult;

    // get comment amount for each post
    const comments = await this.commentService.getCommentsByPostIds(
      results.hits.map((p) => p.id),
    );

    // group by postsId find amount of comments
    const commentsAmount = comments.hits.reduce((acc, comment) => {
      acc[comment.postId] = acc[comment.postId] + 1 || 1;
      return acc;
    }, {});

    // Transform and return the results
    return {
      pagination: {
        total: results.totalHits,
        totalPages: results.totalPages,
        limit: limitNumber,
        page: pageNumber || 0,
      },
      data: results.hits.map((p) => this.transformPost(p, commentsAmount)),
    };
  }

  async deletePost(id: string) {
    await this.meilisearchService.deleteDocument('posts', id);
    await this.firestoreService.deleteById('posts', id);

    await this.commentService.deleteCommentsByPostId(id);
    await this.meilisearchService.deleteDocumentsByFilter('comments', {
      filter: `postId = "${id}"`,
    });
  }

  /**
   * Transforms raw Meilisearch hit into a PostType.
   * @param post - Raw post data.
   * @param count - Amount of comments for each post.
   */
  private transformPost(
    post: MeilisearchResult['hits'][number],
    count: {
      [key: string]: number;
    },
  ): PostType {
    return {
      id: post.id,
      content: post.content,
      topic: post.topic,
      community: post.community,
      createdBy: post.createdBy,
      createdAt: dayjs(post.createdAt).toDate(),
      updatedAt: dayjs(post.updatedAt).toDate(),
      commentsAmount: count[post.id] || 0,
    };
  }
}
