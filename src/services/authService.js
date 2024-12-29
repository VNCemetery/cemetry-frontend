import apiClient from "../api/apiClient";

export const login = async (username, password) => {
  try {
    const response = await apiClient.post("/auth/login", {
      username,
      password
    });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    if (error.response) {
      switch (error.response.status) {
        case 400: // Bad Request
          throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
        case 401: // Unauthorized
          throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
        case 403: // Forbidden
          throw new Error("Tài khoản của bạn không có quyền truy cập");
        case 404: // Not Found
          throw new Error("Tài khoản không tồn tại");
        case 500: // Server Error
          throw new Error("Lỗi hệ thống, vui lòng thử lại sau");
        default:
          throw new Error("Đăng nhập thất bại, vui lòng thử lại");
      }
    }
    throw new Error("Không thể kết nối đến server");
  }
};

export const refreshToken = async (refreshToken) => {
  try {
    const response = await apiClient.post("/auth/refresh-token", {
      refreshToken
    });
    
    if (!response.data.access_token || !response.data.refresh_token) {
      throw new Error("Invalid response from refresh token endpoint");
    }
    
    return response.data;
  } catch (error) {
    console.error("Refresh token error:", error);
    if (error.response?.status === 400) {
      throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
    }
    throw error;
  }
};

export const logout = async (refreshToken) => {
  try {
    await apiClient.post("/auth/logout", {
      refreshToken
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
};
