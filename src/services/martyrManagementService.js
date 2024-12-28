import { createApiClient } from "../api/apiClient";
const api = createApiClient(null, "/martyrs");

export const getMatyrs = async (name, page, size) => {
  const response = await api.post("/search", {
    name,
    page,
    size,
  });
  return response.data;
};
