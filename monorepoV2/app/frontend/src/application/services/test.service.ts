import { apiClient } from '../../infrastructure/api/apiClient';

export interface TestResponse {
  message: string;
}

export async function testConnection(): Promise<TestResponse> {
  return apiClient<TestResponse>('/api/test', {
    method: 'GET',
  });
} 