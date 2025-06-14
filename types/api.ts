import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

export type ApiErrorResponse = AxiosError<ApiError>;

export interface ApiResponse<T> {
  data: T;
  message?: string;
} 