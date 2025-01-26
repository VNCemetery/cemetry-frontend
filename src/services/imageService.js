import ApiClient from "../api/apiClient";

const imageApi = new ApiClient("/images");

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await imageApi.protected().post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      fileName: response.data.fileName || response.data
    };
  } catch (error) {
    console.error('Upload image error:', error);
    throw error;
  }
};

export const deleteImage = async (fileName) => {
  try {
    const cleanFileName = fileName.replace('/images/', '');
    const response = await imageApi.protected().delete(`/${cleanFileName}`);
    return response.data;
  } catch (error) {
    console.error('Delete image error:', error);
    throw error;
  }
};

export const getImageURL = (imageURL) => {
  let baseURL = imageApi.baseURL;
  return imageURL ? `${baseURL}/${imageURL}` : null;
};
