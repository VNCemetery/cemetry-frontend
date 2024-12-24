import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

class ApiClient {
  #publicInstance = null;
  #protectedInstance = null;
  #baseURL = "";

  constructor(customPath = "") {
    this.#baseURL = `${
      import.meta.env.VITE_APP_API_BASE_URL
    }/api/v1${customPath}`;
  }

  get baseURL() {
    return this.#baseURL;
  }

  #createPublicInstance() {
    return axios.create({
      baseURL: this.#baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  #createProtectedInstance() {
    const instance = axios.create({
      baseURL: this.#baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    instance.interceptors.request.use(
      (config) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = useAuthStore.getState().refreshToken;
            if (!refreshToken) {
              throw new Error("No refresh token");
            }

            const response = await this.public().post("/auth/refresh-token", {
              refreshToken: refreshToken,
            });

            const { access_token, refresh_token } = response.data;
            useAuthStore.getState().setTokens(access_token, refresh_token);

            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return instance(originalRequest);
          } catch (refreshError) {
            useAuthStore.getState().logout();
            throw refreshError;
          }
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }

  public() {
    if (!this.#publicInstance) {
      this.#publicInstance = this.#createPublicInstance();
    }
    return this.#publicInstance;
  }

  protected() {
    if (!this.#protectedInstance) {
      this.#protectedInstance = this.#createProtectedInstance();
    }
    return this.#protectedInstance;
  }
}

export default ApiClient;
