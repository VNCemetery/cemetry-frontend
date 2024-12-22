import axios from "axios";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_BASE_URL}/api/v1`, // Replace with your actual base URL
  withCredentials: true, // Ensures cookies are sent with each request
  headers: {
    "Content-Type": "application/json",
  },
});

// // Add a response interceptor
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     const authStore = useAuthStore.getState();
//     if (
//       (error.response.status === 401 || error.response.status === 403) &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;
//       alert("Token expired. Refreshing token...");
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_BASE_URL}/token/refresh-token`,
//           {},
//           { withCredentials: true }
//         );
//         if (response.status === 200) {
//           return apiClient(originalRequest);
//         }
//       } catch (refreshError) {
//         authStore.logout();
//       }
//     }
//     // Include response details in the thrown error
//     return Promise.reject(error.response ? error.response.data : error);
//   }
// );

// // Add this method to verify the token
// export const verifyToken = (token) => {
//   return apiClient.get(`/verify/${token}`);
// };

export default apiClient;
