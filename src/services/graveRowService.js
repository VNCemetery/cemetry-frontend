import ApiClient from "../api/apiClient";

const graveRowApi = new ApiClient("/grave-row");

export const getGraveRows = async () => {
  const response = await graveRowApi.public().get("");
  return response.data;
};
