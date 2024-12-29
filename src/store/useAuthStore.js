import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { login as loginApi, refreshToken as refreshTokenApi, logout as logoutApi } from "../services/authService";

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      expiresIn: null,
      user: null,
      login: async (username, password) => {
        try {
          const response = await loginApi(username, password);
          set({ 
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            expiresIn: response.expires_in,
            user: username
          });
          return response;
        } catch (error) {
          throw error;
        }
      },
      logout: async () => {
        try {
          const currentState = useAuthStore.getState();
          // Gọi API logout để vô hiệu hóa refresh token
          if (currentState.refreshToken) {
            await logoutApi(currentState.refreshToken);
          }
        } finally {
          // Xóa toàn bộ thông tin đăng nhập
          set({ 
            accessToken: null, 
            refreshToken: null, 
            expiresIn: null,
            user: null 
          });
        }
      },
      setTokens: (access_token, refresh_token, expires_in) => set({
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
