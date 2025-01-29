export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Nếu imagePath đã là URL đầy đủ thì trả về luôn
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Nếu imagePath bắt đầu bằng /images thì bỏ dấu / đầu tiên
  const path = imagePath.startsWith('/images') ? imagePath.substring(1) : imagePath;
  
  return `${import.meta.env.VITE_APP_API_BASE_URL}/${path}`;
}; 