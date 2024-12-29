import apiClient from "../api/apiClient";

// GET martyr by ID
export const getMartyrById = async (id) => {
  try {
    const response = await apiClient.get(`/martyrs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get martyr error:", error);
    if (error.response?.status === 404) {
      throw new Error("Không tìm thấy thông tin liệt sĩ");
    }
    throw new Error("Không thể tải thông tin liệt sĩ");
  }
};

// Search martyrs with pagination and filters
export const searchMartyrs = async (searchParams) => {
  try {
    const response = await apiClient.post('/martyrs/search', {
      name: searchParams.name || '',
      page: searchParams.page || 0,
      size: searchParams.size || 10,
      sort: searchParams.sort || 'createdAt,desc'
    });

    // Log response để debug
    console.log('Search martyrs response:', response.data);

    // Đảm bảo mỗi martyr có trường isHidden
    const martyrs = response.data.content.map(martyr => ({
      ...martyr,
      isHidden: martyr.isHidden || false // Nếu không có trường isHidden thì mặc định là false
    }));

    return {
      ...response.data,
      content: martyrs
    };
  } catch (error) {
    console.error("Search martyrs error:", error);
    throw new Error("Có lỗi xảy ra khi tìm kiếm liệt sĩ");
  }
};

// Create or Update martyr (upsert)
export const upsertMartyr = async (martyrData) => {
  try {
    const formData = new FormData();
    
    // Convert data to FormData
    Object.keys(martyrData).forEach(key => {
      if (key === 'image' && martyrData[key] instanceof File) {
        formData.append('image', martyrData[key]);
      } else if (martyrData[key] !== null && martyrData[key] !== undefined) {
        // Convert dates to ISO string if they are Date objects
        if (martyrData[key] instanceof Date) {
          formData.append(key, martyrData[key].toISOString());
        } else {
          formData.append(key, martyrData[key].toString());
        }
      }
    });

    const response = await apiClient.post('/martyrs/upsert', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Upsert martyr error:", error);
    if (error.response?.status === 400) {
      throw new Error(error.response.data.message || "Dữ liệu không hợp lệ");
    }
    if (error.response?.status === 401) {
      throw new Error("Bạn không có quyền thực hiện thao tác này");
    }
    throw new Error("Có lỗi xảy ra khi lưu thông tin liệt sĩ");
  }
};

// Delete martyr
export const deleteMartyr = async (id) => {
  try {
    const response = await apiClient.delete(`/martyrs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete martyr error:", error);
    if (error.response?.status === 404) {
      throw new Error("Không tìm thấy liệt sĩ");
    }
    if (error.response?.status === 401) {
      throw new Error("Bạn không có quyền thực hiện thao tác này");
    }
    throw new Error("Có lỗi xảy ra khi xóa liệt sĩ");
  }
};

// Get delete history with pagination
export const getDeleteHistory = async (params = {}) => {
  try {
    const response = await apiClient.get('/martyrs/delete-history', { 
      params: {
        page: params.page || 0,
        size: params.size || 10,
        sort: params.sort || 'deletedAt,desc'
      } 
    });
    return response.data;
  } catch (error) {
    console.error("Get delete history error:", error);
    if (error.response?.status === 401) {
      throw new Error("Bạn không có quyền xem lịch sử xóa");
    }
    throw new Error("Có lỗi xảy ra khi tải lịch sử xóa");
  }
};

// Toggle visibility of martyr
export const toggleMartyrVisibility = async (id, isHidden) => {
  try {
    console.log('Sending request to toggle visibility:', { id, isHidden });
    
    const response = await apiClient.patch(`/martyrs/${id}/visibility`, { 
      isHidden: isHidden 
    });
    
    console.log('Toggle visibility response:', response.data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || "Không thể thay đổi trạng thái hiển thị");
    }
    
    return response.data;
  } catch (error) {
    console.error("Toggle visibility error:", error);
    
    if (error.response) {
      console.error("Error response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    
    if (error.response?.status === 404) {
      throw new Error("Không tìm thấy liệt sĩ");
    }
    if (error.response?.status === 401) {
      throw new Error("Bạn không có quyền thực hiện thao tác này");
    }
    throw new Error(error.message || "Có lỗi xảy ra khi thay đổi trạng thái hiển thị");
  }
}; 