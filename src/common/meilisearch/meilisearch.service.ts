import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DocumentsDeletionQuery,
  MeiliSearch,
  SearchResponse,
} from 'meilisearch';

@Injectable()
export class MeilisearchService {
  private client: MeiliSearch;

  constructor(private readonly configService: ConfigService) {
    console.log({
      host: this.configService.get<string>('MEILI_HOST'),
      apiKey: this.configService.get<string>('MEILI_API_KEY'),
    });
    this.client = new MeiliSearch({
      host: this.configService.get<string>('MEILI_HOST'),
      apiKey: this.configService.get<string>('MEILI_API_KEY'),
    });
  }

  getIndex(indexName: string) {
    return this.client.index(indexName);
  }

  async addDocuments(indexName: string, documents: Record<string, any>[]) {
    const index = this.getIndex(indexName);
    try {
      return index.addDocuments(documents);
    } catch (error) {
      console.error(error);
    }
  }

  async search(indexName: string, query: string) {
    const index = this.getIndex(indexName);
    return index.search(query);
  }

  async addDocumentWithSubstrings(
    indexName: string,
    document: Record<string, any>,
    field: string,
  ) {
    const index = this.getIndex(indexName);
    const processedDocument = {
      ...document,
      substrings: this.generateSubstrings(document[field] || ''),
    };
    console.log({ processedDocument });
    return index.addDocuments([processedDocument]);
  }

  generateSubstrings(text: string): string[] {
    const substrings = [];
    for (let i = 0; i < text.length; i++) {
      for (let j = i + 1; j <= text.length; j++) {
        substrings.push(text.slice(i, j));
      }
    }
    return substrings;
  }

  async deleteDocumentsByFilter(
    indexName: string,
    filter: DocumentsDeletionQuery,
  ) {
    const index = this.getIndex(indexName);
    return index.deleteDocuments(filter);
  }

  async getPaginatedResults(
    indexName: string,
    query: string,
    options: {
      limit?: number;
      page?: number;
      sortBy?: string;
      orderBy?: 'asc' | 'desc';
      filters?: string;
    },
  ): Promise<SearchResponse<Record<string, any>>> {
    const index = this.client.index(indexName);

    // Build sorting parameter
    const sort = options.sortBy
      ? [`${options.sortBy}:${options.orderBy || 'asc'}`]
      : undefined;

    return index.search(query, {
      hitsPerPage: options.limit || 10,
      page: options.page || 0,
      sort,
      filter: options.filters,
    });
  }

  async updateDocument(indexName: string, document: Record<string, any>) {
    const index = this.client.index(indexName);

    const existingDoc = await index.getDocument(document.id);

    const updatedDoc = {
      ...existingDoc, // Existing values
      ...document, // New values (overrides existing)
    };

    // Add (or update) the document
    const task = await index.addDocuments([updatedDoc]);

    // Optional: Return the task details to track indexing status
    return {
      taskUid: task.taskUid,
      message: 'Document update initiated',
    };
  }

  async deleteDocument(indexName: string, documentId: string) {
    const index = this.client.index(indexName);
    return index.deleteDocument(documentId);
  }
}
