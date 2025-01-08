import { createApiClient } from "../api/apiClient";
const api = createApiClient(null, "/grave-row");

export const getGraveRows = async () => {
  const response = await api.get("", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
