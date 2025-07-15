import { apiClient } from '../../infrastructure/api/apiClient';
import { ETypeUser } from '../../domain/enums/ETypeUser.enum';

export interface User {
  userID: number;
  name: string;
  email: string;
  typeUser: {
    typeuserID: number;
    type: ETypeUser;
    description?: string;
  };
  numberPhone?: string;
  countryCode?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface UserFilters {
  email?: string;
  typeUser?: ETypeUser;
  numberPhone?: string;
  countryCode?: string;
}

export async function getUsers(filters?: UserFilters): Promise<User[]> {
  const params = new URLSearchParams();
  
  if (filters?.email) {
    params.append('email', filters.email);
  }
  
  if (filters?.typeUser) {
    params.append('typeUser', filters.typeUser);
  }
  
  if (filters?.numberPhone) {
    params.append('numberPhone', filters.numberPhone);
  }
  
  if (filters?.countryCode) {
    params.append('countryCode', filters.countryCode);
  }
  
  const queryString = params.toString();
  const url = queryString ? `/api/users?${queryString}` : '/api/users';
  
  return apiClient<User[]>(url, {
    method: 'GET',
  });
}

export async function getUserById(id: number): Promise<User> {
  return apiClient<User>(`/api/users/${id}`, {
    method: 'GET',
  });
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  typeUserID: number;
  numberPhone?: string;
  countryCode?: string;
}

export async function createUser(userData: CreateUserData): Promise<User> {
  return apiClient<User>('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  typeUserID?: number;
  numberPhone?: string;
  countryCode?: string;
}

export async function updateUser(id: number, userData: UpdateUserData): Promise<User> {
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