import ApiClient from "../api/apiClient";

const martyrApi = new ApiClient("/martyrs");

export const getMatyrs = async (
  name = "",
  page = 0,
  size = 10,
  filters = {},
  sorts = []
) => {
  try {
    const response = await martyrApi.public().post("/search", {
      name,
      page,
      size,
      filters: Object.keys(filters).length > 0 ? filters : null,
      hometown: filters.homeTown || null,
      yearOfBirth: filters.yearOfBirth || null,
      yearOfDeath: filters.yearOfDeath || null,
      sorts: sorts.length > 0 ? sorts : null,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMartyrById = async (id) => {
  try {
    const response = await martyrApi.public().get(`/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMartyr = async (id, data) => {
  try {
    // Chuẩn bị data theo format API yêu cầu
    const martyrData = {
      id: data.id,
      image: data.image,
      graveCode: data.graveCode || null,
      fullName: data.fullName,
      name: data.name,
      codeName: data.codeName,
      yearOfBirth: data.yearOfBirth,
      dateOfEnlistment: data.yearOfEnlistment?.toString(), // Chuyển sang string
      dateOfDeath: data.dateOfDeath,
      rankPositionUnit: data.rankPositionUnit,
      homeTown: data.homeTown,
      placeOfExhumation: data.placeOfExhumation,
      dieuChinh: data.dieuChinh || null,
      quyTap: data.quyTap || null,
      ngayThangNam: data.ngayThangNam || null,
      note: data.note || null,
      commune: data.commune,
      district: data.district,
      graveRowId: data.graveRowId,
    };

    const response = await martyrApi.protected().post("/upsert", martyrData);
    return response.data;
  } catch (error) {
    console.error("Service Error:", error);
    throw error;
  }
};

export const deleteMartyr = async (id) => {
  try {
    const response = await martyrApi.protected().delete(`/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getStats = async () => {
  try {
    const response = await martyrApi.public().post("/search", {
      name: "",
      page: 0,
      size: 99999,
    });
    return {
      totalMartyrs: response.data?.content?.length || 0,
    };
  } catch (error) {
    console.error("Stats Error:", error);
    throw error;
  }
};
