// ResultType Interface for Meilisearch results
export interface MeilisearchResult {
  estimatedTotalHits?: number;
  hits: Array<{
    id: string;
    title: string;
    content: string;
    topic: string;
    community: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  }>;
}
