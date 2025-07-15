import { apiClient } from '../../infrastructure/api/apiClient';
import { User } from '../../domain/types/User';

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterUserInput extends Omit<User, 'id' | 'typeUser'> {
  password: string;
  typeUserID: number;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiClient<LoginResponse>(`/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(data: RegisterUserInput): Promise<any> {
  return apiClient<any>(`/api/users`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function logout(): void {
  // Limpiar localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('token');
} 