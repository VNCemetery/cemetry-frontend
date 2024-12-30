import { createApiClient } from "../api/apiClient";

const api = createApiClient();

export const login = async (username, password) => {
  const response = await api.post("/auth/login", {
    username,
    password,
  });
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post("/auth/refresh-token");
  return response.data;
};

export const logout = async (refresh_token) => {
  const response = await api.post("/auth/logout", {
    refreshToken: refresh_token
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email: email
  });
  return response.data;
};

export const resetPassword = async (code, newPassword) => {
  const response = await api.post("/auth/reset-password", {
    code: code,
    newPassword: newPassword
  });
  return response.data;
};

export const requestChangePassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email: email
  });
  return response.data;
};

export const confirmChangePassword = async (code, newPassword) => {
  const response = await api.post("/auth/reset-password", {
    code: code,
    newPassword: newPassword
  });
  return response.data;
};
