import { Box, Select, Button } from "@mantine/core";

const areas = [
  { value: 'A1', label: 'A1' },
  { value: 'A2', label: 'A2' },
  { value: 'A7', label: 'A7' },
];

const rows = [
  { value: 'B1', label: 'B1' },
  { value: 'B2', label: 'B2' },
  { value: 'B3', label: 'B3' },
];

const positions = [
  { value: 'C1', label: 'C1' },
  { value: 'C2', label: 'C2' },
  { value: 'C3', label: 'C3' },
];

export default function LocationSearchForm({ onSearch }) {
  return (
    <Box p="md">
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        onSearch({
          area: formData.get('area'),
          row: formData.get('row'),
          position: formData.get('position')
        });
      }}>
        <Select
          name="area"
          label="Khu"
          placeholder="Chọn khu"
          data={areas}
          searchable
          mb="sm"
          withinPortal
          dropdownPosition="bottom"
          zIndex={9999}
        />

        <Select
          name="row"
          label="Hàng"
          placeholder="Chọn hàng"
          data={rows}
          searchable
          mb="sm"
          withinPortal
          dropdownPosition="bottom"
          zIndex={9999}
        />

        <Select
          name="position"
          label="Mộ"
          placeholder="Chọn mộ"
          data={positions}
          searchable
          mb="sm"
          withinPortal
          dropdownPosition="bottom"
          zIndex={9999}
        />

        <Button type="submit" fullWidth>
          Tìm kiếm
        </Button>
      </form>
    </Box>
  );
} 