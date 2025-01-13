import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginAdmin } from '../services/authService'

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginAdmin(username, password);
          set({
            accessToken: response.accessToken,
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return response;
        } catch (error) {
          set({
            error: error.message || 'Đăng nhập thất bại',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },
    }),
    {
      name: 'auth-storage', 
      getStorage: () => localStorage, 
    }
  )
)
