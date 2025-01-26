import ApiClient from "../api/apiClient";

const martyrApi = new ApiClient("/martyrs");

export const getMatyrs = async (name = "", page = 0, size = 10, filters = {}) => {
  try {
    console.log("Service sending request with:", { name, page, size, filters }); // Debug log
    
    const response = await martyrApi.public().post("/search", {
      name,
      page,
      size,
      hometown: filters.hometown || null,
      yearOfBirth: filters.yearOfBirth || null,
      yearOfDeath: filters.yearOfDeath || null,
    });

    console.log("Service received response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error("Service error:", error);
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

    // Convert formData to JSON
    for (const key in data) {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        jsonData[key] = data[key];
      }
    }

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
