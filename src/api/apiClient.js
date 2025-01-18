import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

class ApiClient {
  #publicInstance = null;
  #protectedInstance = null;

  constructor(customPath = "") {
    this.baseURL = `${
      import.meta.env.VITE_APP_API_BASE_URL
    }/api/v1${customPath}`;
  }

  #createPublicInstance() {
    return axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  #createProtectedInstance() {
    const instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    instance.interceptors.request.use(
      (config) => {
        const currentToken = useAuthStore.getState().accessToken;
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }
        console.log("API Request:", config);
        return config;
      },
      (error) => {
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
