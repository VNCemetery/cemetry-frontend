import { 
  Title, 
  Group, 
  Button, 
  Table,
  ActionIcon,
  TextInput,
  Menu,
  Badge,
  Center,
  Image,
  LoadingOverlay,
  Pagination,
  Text,
  Select,
  Tooltip
} from '@mantine/core';
import { IconPlus, IconDots, IconEdit, IconTrash, IconSearch, IconEyeCheck, IconEyeOff, IconPhoto, IconEye } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { searchMartyrs, deleteMartyr, toggleMartyrVisibility } from '../../../services/martyrService';

export default function MartyrsManage() {
  const navigate = useNavigate();
  const [martyrs, setMartyrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [togglingId, setTogglingId] = useState(null);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const fetchMartyrs = async (page = 1) => {
    try {
      setLoading(true);
      const response = await searchMartyrs({
        name: search,
        page: page - 1,
        size: pageSize
      });
      setMartyrs(response.content);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (error) {
      setError('Không thể tải danh sách liệt sĩ');
      notifications.show({
        title: 'Lỗi',
        message: 'Không thể tải danh sách liệt sĩ',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMartyrs(1);
  }, []);

  useEffect(() => {
    if (shouldRefresh) {
      fetchMartyrs(currentPage);
      setShouldRefresh(false);
    }
  }, [currentPage, shouldRefresh]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
    fetchMartyrs(1);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(Number(value));
    setCurrentPage(1);
    fetchMartyrs(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchMartyrs(page);
  };

  const handleDelete = async (martyr) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa liệt sĩ ${martyr.fullName}? Hành động này không thể hoàn tác.`)) {
      return;
    }

    try {
      await deleteMartyr(martyr.id);
      notifications.show({
        title: 'Thành công',
        message: 'Đã xóa liệt sĩ',
        color: 'green'
      });
      fetchMartyrs(currentPage);
    } catch (error) {
      notifications.show({
        title: 'Lỗi',
        message: error.message || 'Không thể xóa liệt sĩ',
        color: 'red'
      });
    }
  };

  const handleToggleVisibility = async (martyr) => {
    try {
      setTogglingId(martyr.id);
      
      const newHiddenState = !martyr.isHidden;
      
      setMartyrs(prevMartyrs => 
        prevMartyrs.map(m => {
          if (m.id === martyr.id) {
            return { ...m, isHidden: newHiddenState };
          }
          return m;
        })
      );

      await toggleMartyrVisibility(martyr.id, newHiddenState);

      notifications.show({
        title: 'Thành công',
        message: `Đã ${newHiddenState ? 'ẩn' : 'hiển thị'} liệt sĩ`,
        color: 'green'
      });
    } catch (error) {
      setMartyrs(prevMartyrs => 
        prevMartyrs.map(m => {
          if (m.id === martyr.id) {
            return { ...m, isHidden: martyr.isHidden };
          }
          return m;
        })
      );

      notifications.show({
        title: 'Lỗi',
        message: error.message || 'Không thể thay đổi trạng thái hiển thị',
        color: 'red'
      });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Quản lý liệt sĩ</Title>
        <Group>
          <Select
            label="Số dòng mỗi trang"
            value={pageSize.toString()}
            onChange={handlePageSizeChange}
            data={[
              { value: '10', label: '10 dòng' },
              { value: '20', label: '20 dòng' },
              { value: '50', label: '50 dòng' },
              { value: '100', label: '100 dòng' }
            ]}
            w={120}
          />
          <Button 
            leftSection={<IconPlus size={14} />}
            onClick={() => navigate('/admin/martyrs/new')}
          >
            Thêm liệt sĩ
          </Button>
        </Group>
      </Group>

      <Group mb="md">
        <TextInput
          placeholder="Tìm kiếm theo tên hoặc quê quán..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => handleSearchChange(e.currentTarget.value)}
          style={{ flex: 1 }}
        />
      </Group>

      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
        
        {error ? (
          <Text c="red" ta="center" py="xl">{error}</Text>
        ) : (
          <>
            <Table striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>STT</Table.Th>
                  <Table.Th>Ảnh</Table.Th>
                  <Table.Th>Mã liệt sĩ</Table.Th>
                  <Table.Th>Họ và tên</Table.Th>
                  <Table.Th>Năm sinh</Table.Th>
                  <Table.Th>Ngày hy sinh</Table.Th>
                  <Table.Th>Quê quán</Table.Th>
                  <Table.Th>Hàng mộ</Table.Th>
                  <Table.Th>Trạng thái</Table.Th>
                  <Table.Th style={{ width: 120 }}>Thao tác</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {martyrs.map((martyr, index) => (
                  <Table.Tr key={martyr.id}>
                    <Table.Td>{(currentPage - 1) * pageSize + index + 1}</Table.Td>
                    <Table.Td style={{ width: 60, padding: '8px' }}>
                      {martyr.image ? (
                        <Image
                          src={martyr.image}
                          alt={martyr.fullName}
                          width={40}
                          height={40}
                          radius="sm"
                          fit="cover"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            window.open(martyr.image, '_blank');
                          }}
                        />
                      ) : (
                        <Center>
                          <IconPhoto size={20} color="gray" />
                        </Center>
                      )}
                    </Table.Td>
                    <Table.Td>{martyr.codeName}</Table.Td>
                    <Table.Td>{martyr.fullName}</Table.Td>
                    <Table.Td>{martyr.yearOfBirth}</Table.Td>
                    <Table.Td>
                      {/* {martyr.dateOfDeath ? new Date(martyr.dateOfDeath).toLocaleDateString('vi-VN') : ''} */}
                      {martyr.dateOfDeath}
                    </Table.Td>
                    <Table.Td>{martyr.hometown}</Table.Td>
                    <Table.Td>{martyr.graveRow}</Table.Td>
                    <Table.Td>
                      <Badge 
                        color={martyr.isHidden ? 'red' : 'green'}
                        leftSection={martyr.isHidden ? <IconEyeOff size={14}/> : <IconEye size={14}/>}
                      >
                        {martyr.isHidden ? 'Đã ẩn' : 'Hiển thị'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Tooltip label={martyr.isHidden ? "Hiển thị" : "Ẩn"}>
                          <ActionIcon
                            variant="subtle"
                            color={martyr.isHidden ? "blue" : "red"}
                            onClick={() => handleToggleVisibility(martyr)}
                            loading={togglingId === martyr.id}
                            disabled={togglingId === martyr.id}
                          >
                            {martyr.isHidden ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                          </ActionIcon>
                        </Tooltip>

                        <Menu position="bottom-end" shadow="md">
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                              <IconDots size={16} />
                            </ActionIcon>
                          </Menu.Target>

                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconEdit size={14} />}
                              onClick={() => navigate(`/admin/martyrs/${martyr.id}`)}
                            >
                              Chỉnh sửa
                            </Menu.Item>
                            <Menu.Item
                              color="red"
                              leftSection={<IconTrash size={14} />}
                              onClick={() => handleDelete(martyr)}
                            >
                              Xóa
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
                {martyrs.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={10}>
                      <Text ta="center" c="dimmed">
                        Không có dữ liệu
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>

            <Group justify="space-between" mt="md">
              <Text size="sm" c="dimmed">
                Hiển thị {martyrs.length} / {totalPages * pageSize} liệt sĩ
              </Text>
              {totalPages > 1 && (
                <Pagination 
                  value={currentPage}
                  onChange={handlePageChange}
                  total={totalPages}
                />
              )}
            </Group>
          </>
        )}
      </div>
    </>
  );
} 