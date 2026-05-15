import { defineStore } from 'pinia';
import Cookies from 'js-cookie';
import type { User } from '@/types/auth';
import { authService } from '@/services/authService';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: Cookies.get(TOKEN_KEY) || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async register(userData: User) {
      try {
        const { user, token } = await authService.register(userData);
        this.setAuth(user, token);
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    },

    async login(email: string) {
      try {
        const { user, token } = await authService.login(email);
        this.setAuth(user, token);
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },

    setAuth(user: User, token: string) {
      this.user = user;
      this.token = token;
      
      // Store token in cookies
      Cookies.set(TOKEN_KEY, token, { expires: 7, secure: false }); // secure: false for dev
      
      // Store user info (simplified for mock)
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    logout() {
      this.user = null;
      this.token = null;
      Cookies.remove(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },

    initialize() {
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }
    }
  },
});
