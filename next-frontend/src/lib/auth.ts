import api from './api';
import { AuthResponse, LoginData, RegisterData } from '@/types/auth';
import { AxiosResponse } from 'axios';

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', data);
    return response.data;
  },
};
