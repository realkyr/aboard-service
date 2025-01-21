import { queryCondition } from './firestore.schema';

export interface PostQuery {
  collection: string;
  limit: number;
  startAfterId?: string;
  sortBy?: string;
  sortOrder: 'asc' | 'desc';
  searchField?: string;
  searchValue?: string;
  queryConditions?: queryCondition[];
}
