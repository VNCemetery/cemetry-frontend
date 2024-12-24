import { createApiClient } from "../api/apiClient";
const api = createApiClient(null, "/martyrs");

export const getAutoComplete = async (name) => {
  // delay 1s
  await new Promise((resolve) => setTimeout(resolve, 1000));
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
  // const response = await api.post("/search", {
  //   name,
  //   page: 0,
  //   size: 10,
  // });
  // alert(JSON.stringify(response.data));
  // return response.data;
};
