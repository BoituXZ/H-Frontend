export interface ApiError {
  message: string;
  type: 'validation' | 'auth' | 'network' | 'server' | 'forbidden' | 'not-found' | 'unknown';
  errors?: Record<string, string[]>;
  statusCode?: number;
}
