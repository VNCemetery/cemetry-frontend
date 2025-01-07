import { createApiClient } from "../api/apiClient";
const api = createApiClient(null, "/martyrs");

export const getMatyrs = async (name = "", page = 0, size = 10, filters) => {
  try {
    const response = await api.post("/search", {
      name,
      page,
      size,
      filters,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMartyrById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMartyr = async (id, data) => {
  try {
    // Convert data to JSON string for non-file data
    const jsonData = {};
    const formData = new FormData();

    // Xử lý các trường dữ liệu
    Object.keys(data).forEach((key) => {
      if (key === "image" && data[key] instanceof File) {
        // Nếu là file thì thêm vào formData
        formData.append("image", data[key]);
      } else if (key === "dateOfDeath" && data[key]) {
        // Format date
        jsonData[key] = data[key].toISOString().split("T")[0];
      } else if (data[key] !== null && data[key] !== undefined) {
        // Các trường dữ liệu khác
        jsonData[key] = data[key];
      }
    });

    // Thêm JSON data vào formData
    formData.append("data", JSON.stringify(jsonData));

    // Log để debug
    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await api.post("/upsert", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Service Error:", error);
    throw error;
  }
};

export const deleteMartyr = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStats = async () => {
  try {
    // Lấy tất cả liệt sĩ để đếm
    const response = await api.post("/search", {
      name: "",
      page: 0,
      size: 99999, // Lấy với size lớn để có tất cả
    });

    // Đếm số lượng liệt sĩ từ content
    const totalMartyrs = response.data?.content?.length || 0;

    return {
      totalMartyrs: totalMartyrs,
    };
  } catch (error) {
    console.error("Stats Error:", error);
    throw error;
  }
};
