import { apiClient } from '../../infrastructure/api/apiClient';
import { ETypeUser } from '../../domain/enums/ETypeUser.enum';

export interface User {
  id: number;
  email: string;
  typeUser: ETypeUser;
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  email?: string;
  typeUser?: ETypeUser;
}

export interface UsersResponse {
  users: User[];
  total: number;
}

export async function getUsers(filters?: UserFilters): Promise<UsersResponse> {
  const params = new URLSearchParams();
  
  if (filters?.email) {
    params.append('email', filters.email);
  }
  
  if (filters?.typeUser) {
    params.append('typeUser', filters.typeUser);
  }
  
  const queryString = params.toString();
  const url = queryString ? `/api/users?${queryString}` : '/api/users';
  
  return apiClient<UsersResponse>(url, {
    method: 'GET',
  });
}

export async function createUser(userData: { email: string; password: string; typeUser: ETypeUser }): Promise<User> {
  return apiClient<User>('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function updateUser(id: number, userData: Partial<User>): Promise<User> {
  return apiClient<User>(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
}

export async function deleteUser(id: number): Promise<void> {
  return apiClient<void>(`/api/users/${id}`, {
    method: 'DELETE',
  });
} 