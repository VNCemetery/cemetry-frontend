import ApiClient from "../api/apiClient";

const graveRowApi = new ApiClient("/images");

export const uploadImage = async (data) => {
  try {
    const formData = new FormData();
    formData.append("file", data);

    const response = await graveRowApi.protected().post("/upload", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteImage = async (fileName) => {
  try {
    const response = await graveRowApi.protected().delete(`/${fileName}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getImageURL = (imageURL) => {
  let baseURL = graveRowApi.baseURL;
  return imageURL ? `${baseURL}/${imageURL}` : null;
};
