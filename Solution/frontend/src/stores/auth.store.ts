import api from '@/lib/axios';
import { User } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'role'>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        console.log('>>', response);
        const { token, user } = response.data;

        // Set token in axios default headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Update store
        set({ token, user });

        // Store token in localStorage
        localStorage.setItem('token', token);
      },

      logout: () => {
        // Clear token from axios headers
        delete api.defaults.headers.common['Authorization'];

        // Clear localStorage
        localStorage.removeItem('token');

        // Clear store
        set({ token: null, user: null });
      },

      register: async (userData) => {
        await api.post('/auth/register', userData);
      },
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      partialize: (state) => ({ token: state.token, user: state.user }), // persist only these fields
    }
  )
);

// Add axios interceptor for token handling
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
