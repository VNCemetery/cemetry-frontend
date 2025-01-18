import ApiClient from "../api/apiClient";

const authApi = new ApiClient("/auth");

export const login = async (username, password) => {
  const response = await authApi
    .public()
    .post("/login", { username, password });
  return response.data;
};

export const refreshToken = async () => {
  const response = await authApi.protected().post("/refresh-token");
  return response.data;
};

export const logout = async (refresh_token) => {
  const response = await authApi.protected().post(
    "/logout",
    {
      refreshToken: refresh_token,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await authApi.public().post("/forgot-password", {
    email: email,
  });
  return response.data;
};

export const resetPassword = async (code, newPassword) => {
  const response = await authApi.public().post("/reset-password", {
    code: code,
    newPassword: newPassword,
  });
  return response.data;
};

export const requestChangePassword = async (email) => {
  const response = await authApi.public().post("/forgot-password", {
    email: email,
  });
  return response.data;
};

export const confirmChangePassword = async (code, newPassword) => {
  const response = await authApi.public().post("/reset-password", {
    code: code,
    newPassword: newPassword,
  });
  return response.data;
};
