export interface ApiResponse<T> {
  message: string;
  code: number;
  result: T | null;
  error?: string;
}

export interface ApiResponsePagination<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
