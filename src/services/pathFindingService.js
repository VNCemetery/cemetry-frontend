import ApiClient from "../api/apiClient";

const pathFindingApi = new ApiClient("/path-finding");

export const findPath = async (
  currentLocation = { latitude: 0, longitude: 0 },
  graveRowId
) => {
  try {
    const response = await pathFindingApi.public().post("", {
      currentLocation,
      graveRowId,
    });
    return {
      ...response.data,
      pathId: response.data.id,
    };
  } catch (error) {
    throw error;
  }
};

export const provideFeedback = async (pathId, isGood) => {
  try {
    const response = await pathFindingApi.public().post("/feedback", {
      pathId,
      isGood,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
