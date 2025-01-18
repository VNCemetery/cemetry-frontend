import ApiClient from "../api/apiClient";

const martyrApi = new ApiClient("/martyrs");

export const getMatyrs = async (name = "", page = 0, size = 10, filters) => {
  try {
    const response = await martyrApi.public().post("/search", {
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
    const response = await martyrApi.public().get(`/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMartyr = async (id, data) => {
  try {
    const jsonData = {};
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "image" && data[key] instanceof File) {
        formData.append("image", data[key]);
      } else if (key === "dateOfDeath" && data[key]) {
        jsonData[key] = data[key].toISOString().split("T")[0];
      } else if (data[key] !== null && data[key] !== undefined) {
        jsonData[key] = data[key];
      }
    });

    formData.append("data", JSON.stringify(jsonData));

    const response = await martyrApi.protected().post("/upsert", jsonData);
    return response.data;
  } catch (error) {
    console.error("Service Error:", error);
    throw error;
  }
};

export const deleteMartyr = async (id) => {
  try {
    const response = await martyrApi.protected().delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStats = async () => {
  try {
    const response = await martyrApi.public().post("/search", {
      name: "",
      page: 0,
      size: 99999,
    });
    return {
      totalMartyrs: response.data?.content?.length || 0,
    };
  } catch (error) {
    console.error("Stats Error:", error);
    throw error;
  }
};
