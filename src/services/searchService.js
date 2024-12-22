import apiClient from "../api/apiClient";

export const searchMatyrs = async (name, page = 0, size = 10) => {
  // Mock 3 seconds response mock data
  try {
    const response = await apiClient.get("/martyrs/search", {
      name,
      page,
      size,
    });
  } catch (error) {
    throw new Error("Error when searching");
  }
};
