import apiClient from "../api/apiClient";

export const getAutoComplete = async (name) => {
  try {
    const response = await apiClient.post("/martyrs/search", {
      name,
      page: 0,
      size: 10,
    });
    return response.data;
  } catch (error) {
    console.error("Search error:", error);
    // Tạm thời trả về mock data khi có lỗi
    return [
      {
        id: "0182942c-5009-4fdb-ba9d-312ac28745a6",
        areaName: "A 1",
        rowName: "VH- Số1",
        fullName: "Nguyễn Văn Sồi",
        name: "Sồi",
        codeName: "",
        yearOfBirth: "",
        dateOfEnlistment: "",
        dateOfDeath: "",
        rankPositionUnit: "Thượng sĩ, D 502",
        homeTown: "",
        placeOfExhumation: "",
        note: "",
        commune: "",
        district: "",
      },
    ];
  }
};
