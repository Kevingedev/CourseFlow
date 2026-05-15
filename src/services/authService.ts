import api from './api';
import type { User, AuthResponse } from '@/types/auth';

const MOCK_TOKEN = import.meta.env.VITE_MOCK_TOKEN;

export const authService = {
  /**
   * Registers a new user.
   * In a mock environment, it saves to JSON Server.
   * In production, it will hit the Python API.
   */
  async register(userData: User): Promise<AuthResponse> {
    const response = await api.post('/users', {
      ...userData,
      createdAt: new Date().toISOString()
    });

    return {
      user: response.data,
      token: MOCK_TOKEN
    };
  },

  /**
   * Logs in a user.
   * In mock, it checks by email.
   * In production, it will return a real JWT.
   */
  async login(email: string): Promise<AuthResponse> {
    // Mock login logic: find user by email
    const response = await api.get(`/users?email=${email}`);
    const user = response.data[0];

    if (!user) {
      throw new Error('User not found');
    }

    return {
      user,
      token: MOCK_TOKEN
    };
  }
};
