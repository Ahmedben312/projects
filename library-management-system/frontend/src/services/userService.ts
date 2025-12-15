import api from './api';
import { User, PaginatedResponse, FilterOptions, AuthResponse, LoginCredentials } from '../types';

export const userService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  async getUsers(filters: FilterOptions = {}): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/users?${params}`);
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt' | 'borrowedBooks'>): Promise<User> {
    const response = await api.post('/users', userData);
    return response.data;
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async changeUserRole(id: string, role: string): Promise<User> {
    const response = await api.patch(`/users/${id}/role`, { role });
    return response.data;
  },
};
