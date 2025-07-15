export interface BaseEntity {
  id: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateEntityData {
  [key: string]: unknown;
}

export interface UpdateEntityData {
  [key: string]: unknown;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  where?: Record<string, unknown>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
