import { MeilisearchService } from '../common/meilisearch/meilisearch.service';
import { Pagination } from '@shared-types/pagination';
import { PostType } from '@shared-types/post';
import { BadRequestException, Injectable } from '@nestjs/common';
import { MeilisearchResult } from './types';
import dayjs from 'dayjs';
import { FirestoreService } from '../common/firestore/firestore.service';

@Injectable()
export class PostService {
  constructor(
    private readonly meilisearchService: MeilisearchService,
    private readonly firestoreService: FirestoreService,
  ) {}

  async getPosts(
    query: string = '',
    limit?: number,
    offset?: number,
    sortBy?: string,
    orderBy: 'asc' | 'desc' = 'asc',
    community?: string,
    createdBy?: string,
  ): Promise<{
    pagination: Pagination;
    data: PostType[];
  }> {
    // Convert and validate limit and offset
    const limitNumber = this.parseNumber(limit, 'Limit');
    const offsetNumber = this.parseNumber(offset, 'Offset');

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
        offset: offsetNumber,
        sortBy,
        orderBy,
        filters: filtersArray.join(' AND '),
      })) as unknown as MeilisearchResult;

    // Transform and return the results
    return {
      pagination: {
        total: results.estimatedTotalHits,
        limit: limitNumber,
        offset: offsetNumber || 0,
      },
      data: results.hits.map((p) => this.transformPost(p)),
    };
  }

  async deletePost(id: string) {
    await this.meilisearchService.deleteDocument('posts', id);
    return this.firestoreService.deleteById('posts', id);
  }

  /**
   * Parses a number and validates it.
   * @param value - The value to parse.
   * @param fieldName - Name of the field for error messages.
   */
  private parseNumber(value?: number, fieldName?: string): number | undefined {
    if (value === undefined) return undefined;
    const parsed = Number(value);
    if (isNaN(parsed)) {
      throw new BadRequestException(`${fieldName} must be a valid number`);
    }
    return parsed;
  }

  /**
   * Transforms raw Meilisearch hit into a PostType.
   * @param post - Raw post data.
   */
  private transformPost(post: MeilisearchResult['hits'][number]): PostType {
    return {
      id: post.id,
      content: post.content,
      topic: post.topic,
      community: post.community,
      createdBy: post.createdBy,
      createdAt: dayjs(post.createdAt).toDate(),
      updatedAt: dayjs(post.updatedAt).toDate(),
    };
  }
}
