export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

export interface AxiosErrorResponse {
  data: ApiError;
  status: number;
  statusText: string;
}

export interface CustomError extends Error {
  response?: AxiosErrorResponse;
}

export function isAxiosError(error: unknown): error is CustomError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as CustomError).response === 'object'
  );
}

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    return error.response?.data?.message || 'An error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred';
}
