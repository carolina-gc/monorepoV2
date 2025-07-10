import { apiClient } from '../../infrastructure/api/apiClient';
import { ETypeUser } from '../../domain/enums/ETypeUser.enum';

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    typeUser: ETypeUser;
  };
  token: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiClient<LoginResponse>(`/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
} 