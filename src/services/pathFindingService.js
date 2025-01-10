import { createApiClient } from "../api/apiClient";
const api = createApiClient(null, "/path-finding");

export const findPath = async (
  currentLocation = {
    latitude: 0,
    longitude: 0,
  },
  graveRowId
) => {
  try {
    const response = await api.post("", {
      currentLocation,
      graveRowId,
    });
    return {
      ...response.data,
      pathId: response.data.id, // Assuming the API returns an ID
    };
  } catch (error) {
    throw error;
  }
};

export const provideFeedback = async (pathId, isGood) => {
  try {
    const response = await api.post("/feedback", {
      pathId,
      isGood,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
