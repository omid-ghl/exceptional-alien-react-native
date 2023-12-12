export interface ApiResponse<T> {
  success: 'true' | 'false';
  data: T;
}
