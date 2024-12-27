import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { refreshToken as refreshTokenApi } from "../services/authService";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để thêm token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const state = useAuthStore.getState();
        // Sử dụng service để refresh token
        const response = await refreshTokenApi(state.refreshToken);
        const { access_token, refresh_token, expires_in } = response;
        
        // Cập nhật tokens mới vào store
        state.setTokens(access_token, refresh_token, expires_in);

        // Thử lại request ban đầu với access token mới
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Thêm lại hàm createApiClient
export const createApiClient = (token = null, custom_path = "") => {
  return axios.create({
    baseURL: `http://localhost:8000/api/v1${custom_path}`,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export default apiClient;
