export type ApiError = {
  field?: string;   
  message: string;  
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  errors: ApiError[] | null;
};
