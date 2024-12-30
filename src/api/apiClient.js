import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_BASE_URL}/api/v1`, // Replace with your actual base URL
  withCredentials: true, // Ensures cookies are sent with each request
  headers: {
    "Content-Type": "application/json",
  },
});

export const createApiClient = (token = null, custom_path = "") => {
  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_APP_API_BASE_URL}/api/v1${custom_path}`,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  // Add request interceptor to log requests
  instance.interceptors.request.use(
    (config) => {
      const currentToken = useAuthStore.getState().accessToken;
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
      console.log('API Request:', config);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/auth/refresh-token`,
          {},
          { 
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${useAuthStore.getState().refreshToken}`
            }
          }
        );
        
        if (response.status === 200) {
          const { access_token } = response.data;
          useAuthStore.getState().setAccessToken(access_token);
          
          originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// // Add this method to verify the token
// export const verifyToken = (token) => {
//   return apiClient.get(`/verify/${token}`);
// };

export default apiClient;
