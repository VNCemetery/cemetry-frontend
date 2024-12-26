import { Box, Select, TextInput, Button } from "@mantine/core";
import { useState } from "react";

const provinces = [
  { value: "angiang", label: "An Giang" },
  { value: "dongthap", label: "Đồng Tháp" },
  { value: "vinhlong", label: "Vĩnh Long" },
  { value: "cantho", label: "Cần Thơ" },
  // Thêm các tỉnh khác
];

export default function SearchForm({ onSearch }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      await onSearch({
        name: formData.get("name"),
        province: formData.get("province"),
        birthYear: formData.get("birthYear"),
        deathYear: formData.get("deathYear"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p="md">
      <form onSubmit={handleSubmit}>
        <TextInput
          name="name"
          label="Họ và tên"
          placeholder="Nguyễn Văn X"
          mb="sm"
        />

        <Select
          name="province"
          label="Quê quán"
          placeholder="Chọn tỉnh/thành"
          data={provinces}
          searchable
          mb="sm"
          withinPortal
          dropdownPosition="bottom"
          zIndex={100}
        />

        <TextInput
          name="birthYear"
          label="Năm sinh"
          placeholder="1942"
          type="number"
          mb="sm"
        />

        <TextInput
          name="deathYear"
          label="Năm mất"
          placeholder="1980"
          type="number"
          mb="sm"
        />

        <Button type="submit" fullWidth loading={loading}>
          Tìm kiếm
        </Button>
      </form>
    </Box>
  );
}
