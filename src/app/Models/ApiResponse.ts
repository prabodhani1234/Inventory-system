export interface ApiResponse<T> {
    isSuccess: boolean;
    data?: T;
    message?: string;
    statusCode?: number;
  }