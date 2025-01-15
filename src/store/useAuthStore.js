import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  login as loginApi,
  logout as logoutApi,
  refreshToken as refreshTokenApi,
} from "../services/authService";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginApi(username, password);
          console.log("Login response:", response);

          const { access_token, refresh_token, expires_in } = response;

          if (!access_token) {
            throw new Error("Token không hợp lệ từ server");
          }

          set({
            accessToken: access_token,
            refreshToken: refresh_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return response;
        } catch (error) {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message || "Đăng nhập thất bại",
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          const { refreshToken } = get();
          console.log("Refresh token when logout:", refreshToken);

          if (refreshToken) {
            await logoutApi(refreshToken);
          } else {
            console.warn("Không có refresh token để logout");
          }
        } catch (error) {
          console.error("Lỗi khi logout:", error);
          if (error.response) {
            console.error("Response error:", error.response.data);
          }
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        }
      },

      setAccessToken: (token) => {
        set({
          accessToken: token,
          isAuthenticated: true,
        });
      },

      refreshToken: async () => {
        try {
          const response = await refreshTokenApi();
          const { access_token } = response;
          set({
            accessToken: access_token,
            isAuthenticated: true,
          });
          return response;
        } catch (error) {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
