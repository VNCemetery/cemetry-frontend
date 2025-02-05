import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authService from "../services/authService";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null, 
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      
      setTokens: (accessToken, refreshToken) => {
        set({ 
          accessToken, 
          refreshToken,
          isAuthenticated: true
        });
      },

      setUser: (user) => {
        set({ user });
      },

      login: async (username, password) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.login(username, password);
          
          set({
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            isAuthenticated: true,
            isLoading: false,
          });

          return response;
        } catch (error) {
          set({ 
            error: "Tên đăng nhập hoặc mật khẩu không đúng",
            isLoading: false,
            isAuthenticated: false
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          const refreshToken = get().refreshToken;
          if (refreshToken) {
            await authService.logout(refreshToken);
          }
        } catch (error) {
          console.error("Lỗi khi đăng xuất:", error);
        } finally {
          set({
            accessToken: null,
            refreshToken: null,
            user: null,
            error: null,
            isAuthenticated: false
          });
        }
      },

      refreshAccessToken: async () => {
        try {
          const response = await authService.refreshToken();
          set({
            accessToken: response.access_token,
            refreshToken: response.refresh_token
          });
          return response;
        } catch (error) {
          set({
            accessToken: null,
            refreshToken: null,
            user: null
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
