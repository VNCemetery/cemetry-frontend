import SortableTable from "../SortableTable";
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
  Flex,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
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
  FiFilter,
} from "react-icons/fi";
import { useDebouncedValue } from "@mantine/hooks";
import { useDisclosure } from "@mantine/hooks";
import MartyrDetail from "./MartyrDetail";
import { getImageUrl } from "../../../utils/imageUtils";
import { SelectDropdownSearch } from "../../ui/SelectDropdownSearch";
import { useInfoStore } from "../../../store/useInfoStore";
import { HiCheck } from "react-icons/hi";
import { flattenObject } from "../../../utils/objectUtil";
import { buildFilterFormQuery } from "../../../utils/queryBuilder";
import {
  DEFAULT_AUTO_SUGGEST_SIZE,
  DEFAULT_PAGE,
  DEFAULT_SEARCH_SIZE,
} from "../../../utils/constants";
import Loading from "../../ui/Loading";

export default function MartyrsManage() {
  const navigate = useNavigate();
  const { grave_rows } = useInfoStore();
  const {
    loadMartyrs,
    loading,
    error,
    totalPages,
    matyrs,
    deleteMartyrInStore,
  } = useMatyrStore((state) => state);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const pageSize = 10;
  const [debouncedSearch] = useDebouncedValue(search, 200);
  const [filters, setFilters] = useState({
    homeTown: "",
    yearOfBirth: "",
    dateOfDeath: "",
    areaName: "",
    graveRow: {
      areaName: "",
      rowName: "",
    },
  });
  const [selectedMartyr, setSelectedMartyr] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const handleSort = (key) => {
    let direction =
      sortConfig.key === key && sortConfig.direction === "ASC" ? "DESC" : "ASC";
    setSortConfig({ key, direction });

    // Sửa lại cách gọi loadData khi sort
    const sorts = [{
      key,
      direction,
    }];
    
    // Luôn bắt đầu từ trang 0 khi sort
    loadData(0, DEFAULT_SEARCH_SIZE, [], sorts);
  };

  const loadData = async (
    page = 0, // Mặc định page = 0 thay vì currentPage
    size = DEFAULT_SEARCH_SIZE,
    query_filters = [],
    sorts = []
  ) => {
    setIsUpdating(true);
    try {
      const response = await loadMartyrs(
        debouncedSearch,
        page,
        size,
        query_filters,
        sorts
      );

      if (response?.content) {
        // Chỉ cập nhật currentPage khi không có search và filter
        if (!debouncedSearch && !Object.values(query_filters).some((val) => val)) {
          setCurrentPage(page + 1);
        }
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (error) {
      console.error("Load data error:", error);
      notifications.show({
        title: "Lỗi",
        message: "Không thể tải danh sách liệt sĩ",
        color: "red",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const ALL_VALUE = {
    ALL_VALUE_LABEL: "Tất cả",
  };

  useEffect(() => {
    if (debouncedSearch || Object.values(filters).some((val) => val)) {
      setCurrentPage(DEFAULT_PAGE);
      loadData(DEFAULT_PAGE);
    } else {
      setCurrentPage(DEFAULT_PAGE);
      loadData(DEFAULT_PAGE);
    }
  }, [debouncedSearch, filters]);

  useEffect(() => {
    if (!debouncedSearch && !Object.values(filters).some((val) => val)) {
      loadData(currentPage);
    }
  }, [currentPage]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa liệt sĩ này?")) {
      setIsUpdating(true);
      try {
        await deleteMartyr(id);

        const result = deleteMartyrInStore(id);

        if (result.success) {
          if (result.needsReload) {
            // Load the previous page
            const newPage = result.previousPage;
            setCurrentPage(newPage + 1);
            await loadData(newPage);
          } else {
            notifications.show({
              title: "Thành công",
              message: "Đã xóa liệt sĩ",
              color: "green",
            });
          }
        }
      } catch (error) {
        notifications.show({
          title: "Lỗi",
          message: "Không thể xóa liệt sĩ",
          color: "red",
        });
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleEdit = (martyr) => {
    setSelectedMartyr(martyr);
    open();
  };

  const handleSaveSuccess = () => {
    close();
  };

  const handleApplyFilters = () => {
    const flattenFilters = flattenObject(filters);
    const queryData = {
      ...flattenFilters,
    };

    const filters_query = buildFilterFormQuery(queryData);
    loadData(1, pageSize, filters_query);
  };

  const handleClearFilters = () => {
    setFilters({
      homeTown: "",
      yearOfBirth: "",
      dateOfDeath: "",
      areaName: "",
      graveRow: {
        areaName: "",
        rowName: "",
      },
    });
    const filters_query = buildFilterFormQuery({});
    loadData(1, filters_query);
  };

  const tableColumns = [
    { key: "image", label: "Ảnh", sortable: false },
    { key: "fullName", label: "Họ và tên" },
    { key: "codeName", label: "Bí danh" },
    { key: "yearOfBirth", label: "Năm sinh" },
    { key: "dateOfDeath", label: "Ngày hy sinh" },
    { key: "homeTown", label: "Quê quán" },
    { key: "rowName", label: "Hàng mộ" },
    { key: "status", label: "Trạng thái", sortable: false },
    { key: "actions", label: "Thao tác", sortable: false },
  ];

  const renderCell = (key, martyr) => {
    switch (key) {
      case "image":
        return (
          <div style={{ padding: "8px" }}>
            {martyr.image ? (
              <div style={{ position: "relative" }}>
                <Image
                  src={getImageUrl(martyr.image)}
                  alt={martyr.fullName}
                  width={60}
                  height={60}
                  radius="md"
                  fit="cover"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    window.open(getImageUrl(martyr.image), "_blank");
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.1)",
                    opacity: 0,
                    transition: "opacity 0.2s",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = 1)}
                  onMouseLeave={(e) => (e.target.style.opacity = 0)}
                >
                  <FiEye size={20} color="white" />
                </div>
              </div>
            ) : (
              <Center w={60} h={60} bg="gray.1" style={{ borderRadius: "8px" }}>
                <FiImage size={24} color="gray" />
              </Center>
            )}
          </div>
        );
      case "status":
        return martyr.hidden ? (
          <Badge color="red">Đã ẩn</Badge>
        ) : (
          <Badge color="green">Hiển thị</Badge>
        );
      case "actions":
        return (
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
                  martyr.hidden ? <FiEye size={14} /> : <FiEyeOff size={14} />
                }
                onClick={() => handleVisibilityToggle(martyr)}
              >
                {martyr.hidden ? "Hiển thị" : "Ẩn"}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        );
      default:
        return martyr[key];
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        size="xl"
        title={
          selectedMartyr ? "Chỉnh sửa thông tin liệt sĩ" : "Thêm liệt sĩ mới"
        }
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
        <Grid.Col span={12}>
          <TextInput
            placeholder="Tìm kiếm theo tên"
            leftSection={<FiSearch size={16} />}
            value={search}
            onChange={(e) => {
              const newValue = e.target.value;
              setSearch(newValue);
              if (!newValue) {
                setCurrentPage(DEFAULT_PAGE);
                loadData(DEFAULT_PAGE);
              }
            }}
          />
        </Grid.Col>
      </Grid>
      <Flex className=" p-2 border-[1px] rounded-sm mb-2 border-gray-200 w-full">
        <Grid mb={8}>
          <Grid.Col span={2}>
            <TextInput
              label="Quê quán"
              placeholder=""
              value={filters.homeTown}
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  homeTown: e.target.value,
                }));
              }}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <TextInput
              type="number"
              label="Năm sinh"
              value={filters.yearOfBirth}
              onChange={(e) => {
                const value = e.target.value;
                setFilters((prev) => ({ ...prev, yearOfBirth: value }));
              }}
              min={1900}
              max={new Date().getFullYear()}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <TextInput
              type="number"
              label="Năm hy sinh"
              value={filters.dateOfDeath}
              onChange={(e) => {
                const value = e.target.value;
                setFilters((prev) => ({ ...prev, dateOfDeath: value }));
              }}
              min={1900}
              max={new Date().getFullYear()}
            />
          </Grid.Col>

          <Grid.Col span={2}>
            <SelectDropdownSearch
              size="sm"
              radius="sm"
              placeholder="Chọn khu vực"
              description="Chọn khu"
              value={filters.graveRow.areaName}
              setValue={(value) => {
                setFilters({
                  ...filters,
                  graveRow: {
                    areaName: value === ALL_VALUE.ALL_VALUE_LABEL ? "" : value,
                    rowName: "",
                  },
                });
              }}
              data={
                grave_rows
                  ? [ALL_VALUE.ALL_VALUE_LABEL, ...Object.keys(grave_rows)]
                  : []
              }
            />
          </Grid.Col>
          <Grid.Col span={2}>
            {/* Location Section */}
            <div className="flex flex-col gap-4">
              <SelectDropdownSearch
                size="sm"
                radius="sm"
                label="Chọn khu vực"
                description="Chọn hàng"
                placeholder="Chọn hàng mộ"
                setValue={(value) => {
                  setFilters({
                    ...filters,
                    graveRow: {
                      ...filters.graveRow,
                      rowName: value === ALL_VALUE.ALL_VALUE_LABEL ? "" : value,
                    },
                  });
                }}
                data={[
                  ALL_VALUE.ALL_VALUE_LABEL,
                  ...(grave_rows && grave_rows[filters.graveRow.areaName]
                    ? grave_rows[filters.graveRow.areaName].map(
                        (item) => item.rowName
                      )
                    : []),
                ]}
                value={filters.graveRow.rowName}
              />
            </div>
          </Grid.Col>

          <Grid.Col span={4}>
            <Group position="apart">
              <Button
                variant="light"
                radius={"xl"}
                onClick={handleClearFilters}
              >
                Xóa bộ lọc
              </Button>
              <Button radius={"xl"} onClick={handleApplyFilters}>
                Áp dụng
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </Flex>
      {loading || isUpdating ? (
        <div style={{ position: "relative", minHeight: "200px" }}>
          <Loading />
        </div>
      ) : error ? (
        <Text color="red" align="center">
          {error}
        </Text>
      ) : (
        <>
          <SortableTable
            data={matyrs?.content || []} // Use direct API response instead of sortedData
            columns={tableColumns}
            onSort={handleSort}
            sortConfig={sortConfig}
            renderCell={renderCell}
          />
          {totalPages > 1 && (
            <Group justify="center" mt="xl">
              <Pagination
                value={currentPage == 0 ? 1 : currentPage}
                onChange={(value) => {
                  setCurrentPage(value);
                  loadData(value - 1);
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
