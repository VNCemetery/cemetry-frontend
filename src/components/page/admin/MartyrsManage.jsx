import {
  Title,
  Group,
  Button,
  Table,
  ActionIcon,
  TextInput,
  Menu,
  Badge,
  Text,
  Image,
  Center,
  Pagination,
  Loader,
  Select,
  Grid,
  Modal,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { deleteMartyr } from "../../../services/martyrManagementService";
import { useMatyrStore } from "../../../store/useMatyrStore";
import {
  FiPlus,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiImage,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useDebouncedValue } from '@mantine/hooks';
import { useDisclosure } from '@mantine/hooks';
import MartyrDetail from './MartyrDetail';

export default function MartyrsManage() {
  const navigate = useNavigate();
  const [martyrs, setMartyrs] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const {
    loadAdminMartyrs,
    adminMartyrs: { loading, error, totalPages },
    clearAdminCache,
  } = useMatyrStore();
  const pageSize = 10;
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [filters, setFilters] = useState({
    hometown: '',
    yearOfBirth: '',
    yearOfDeath: '',
  });
  const [selectedMartyr, setSelectedMartyr] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);

  const loadData = async (page = currentPage) => {
    try {
      console.log("Loading with filters:", filters);
      const response = await loadAdminMartyrs(
        debouncedSearch, 
        page, 
        pageSize,
        filters
      );
      
      console.log("API Response:", response);
      
      if (response?.content) {
        setMartyrs(response.content);
      } else {
        console.error("Invalid response format:", response);
        setMartyrs([]);
      }
    } catch (error) {
      console.error("Load data error:", error);
      notifications.show({
        title: "Lỗi",
        message: "Không thể tải danh sách liệt sĩ",
        color: "red",
      });
    }
  };

  useEffect(() => {
    if (debouncedSearch !== search || Object.values(filters).some(val => val)) {
      setCurrentPage(1);
      loadData(1);
    }
  }, [debouncedSearch, filters]);

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    console.log("Filters changed:", filters);
  }, [filters]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa liệt sĩ này?")) {
      try {
        await deleteMartyr(id);
        // Clear cache của trang hiện tại sau khi xóa
        clearAdminCache(search, currentPage - 1);
        notifications.show({
          title: "Thành công",
          message: "Đã xóa liệt sĩ",
          color: "green",
        });
        loadData();
      } catch (error) {
        notifications.show({
          title: "Lỗi",
          message: "Không thể xóa liệt sĩ",
          color: "red",
        });
      }
    }
  };

  const handleEdit = (martyr) => {
    setSelectedMartyr(martyr);
    open();
  };

  const handleSaveSuccess = () => {
    close();
    loadData(currentPage);
  };

  return (
    <>
      <Modal 
        opened={opened} 
        onClose={close}
        size="xl"
        title={selectedMartyr ? "Chỉnh sửa thông tin liệt sĩ" : "Thêm liệt sĩ mới"}
      >
        <MartyrDetail 
          martyr={selectedMartyr}
          onSave={handleSaveSuccess}
          onCancel={close}
        />
      </Modal>

      <Group justify="space-between" mb="lg">
        <Title order={2}>Quản lý liệt sĩ</Title>
        <Button
          leftSection={<FiPlus size={14} />}
          onClick={() => navigate("new")}
        >
          Thêm liệt sĩ
        </Button>
      </Group>

      <Grid mb="md">
        <Grid.Col span={6}>
          <TextInput
            placeholder="Tìm kiếm theo tên..."
            leftSection={<FiSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col span={2}>
          <TextInput
            placeholder="Quê quán"
            value={filters.hometown}
            onChange={(e) => {
              setFilters(prev => ({...prev, hometown: e.currentTarget.value}));
            }}
          />
        </Grid.Col>
        <Grid.Col span={2}>
          <TextInput
            type="number"
            placeholder="Năm sinh"
            value={filters.yearOfBirth}
            onChange={(e) => {
              const value = e.currentTarget.value;
              setFilters(prev => ({...prev, yearOfBirth: value}));
            }}
            min={1900}
            max={new Date().getFullYear()}
          />
        </Grid.Col>
        <Grid.Col span={2}>
          <TextInput
            type="number"
            placeholder="Năm mất"
            value={filters.yearOfDeath}
            onChange={(e) => {
              const value = e.currentTarget.value;
              setFilters(prev => ({...prev, yearOfDeath: value}));
            }}
            min={1900}
            max={new Date().getFullYear()}
          />
        </Grid.Col>
      </Grid>

      {loading ? (
        <Center py="xl">
          <Loader size="lg" />
        </Center>
      ) : error ? (
        <Text color="red" align="center">
          {error}
        </Text>
      ) : (
        <>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Ảnh</Table.Th>
                <Table.Th>Họ và tên</Table.Th>
                <Table.Th>Bí danh</Table.Th>
                <Table.Th>Năm sinh</Table.Th>
                <Table.Th>Ngày hy sinh</Table.Th>
                <Table.Th>Quê quán</Table.Th>
                <Table.Th className="text-center">Hàng mộ</Table.Th>
                <Table.Th>Trạng thái</Table.Th>
                <Table.Th style={{ width: 80 }}>Thao tác</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {martyrs.map((martyr) => (
                <Table.Tr key={martyr.id}>
                  <Table.Td style={{ width: 60, padding: "8px" }}>
                    {martyr.image ? (
                      <Image
                        src={martyr.image}
                        alt={martyr.fullName}
                        width={40}
                        height={40}
                        radius="sm"
                        fit="cover"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          window.open(martyr.image, "_blank");
                        }}
                      />
                    ) : (
                      <Center>
                        <FiImage size={20} color="gray" />
                      </Center>
                    )}
                  </Table.Td>
                  <Table.Td>{martyr.fullName}</Table.Td>
                  <Table.Td>{martyr.codeName}</Table.Td>
                  <Table.Td>{martyr.yearOfBirth}</Table.Td>
                  <Table.Td>{martyr.dateOfDeath || ""}</Table.Td>
                  <Table.Td>
                    {(() => {
                      const location = [];
                      if (martyr.hometown) location.push(martyr.hometown);
                      if (martyr.commune) location.push(martyr.commune);
                      if (martyr.district) location.push(martyr.district);

                      return location.length > 0 ? (
                        location.join(" - ")
                      ) : (
                        <Text c="dimmed" fs="italic">
                          Chưa cập nhật
                        </Text>
                      );
                    })()}
                  </Table.Td>
                  <Table.Td>
                    <Group>
                      {martyr && martyr.rowName && martyr.areaName && (
                        <>
                          <Badge color="blue">{martyr.rowName}</Badge>
                          <Badge color="blue">{martyr.areaName}</Badge>
                        </>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    {martyr.hidden ? (
                      <Badge color="red">Đã ẩn</Badge>
                    ) : (
                      <Badge color="green">Hiển thị</Badge>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Menu shadow="md" width={200}>
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                          <FiMoreVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<FiEdit size={14} />}
                          onClick={() => handleEdit(martyr)}
                        >
                          Chỉnh sửa
                        </Menu.Item>
                        <Menu.Item
                          color="red"
                          leftSection={<FiTrash2 size={14} />}
                          onClick={() => handleDelete(martyr.id)}
                        >
                          Xóa
                        </Menu.Item>
                        <Menu.Item
                          leftSection={
                            martyr.hidden ? (
                              <FiEye size={14} />
                            ) : (
                              <FiEyeOff size={14} />
                            )
                          }
                          onClick={() => {
                            setMartyrs(
                              martyrs.map((m) =>
                                m.id === martyr.id
                                  ? { ...m, hidden: !m.hidden }
                                  : m
                              )
                            );
                          }}
                        >
                          {martyr.hidden ? "Hiển thị" : "Ẩn"}
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          {totalPages > 1 && (
            <Group justify="center" mt="xl">
              <Pagination
                value={currentPage}
                onChange={(page) => {
                  setCurrentPage(page);
                }}
                total={totalPages}
              />
            </Group>
          )}
        </>
      )}
    </>
  );
}
