import { 
    Title, 
    Group, 
    Button, 
    Table, 
    ActionIcon, 
    TextInput,
    Menu,
    Modal,
    Stack,
    Badge,
    Select
  } from '@mantine/core';
  import { useDisclosure } from '@mantine/hooks';
  import { lazy, Suspense } from 'react';
  
  // Lazy load các icons
  const IconPlus = lazy(() => import('@tabler/icons-react').then(module => ({ default: module.IconPlus })));
  const IconDots = lazy(() => import('@tabler/icons-react').then(module => ({ default: module.IconDots })));
  const IconEdit = lazy(() => import('@tabler/icons-react').then(module => ({ default: module.IconEdit })));
  const IconTrash = lazy(() => import('@tabler/icons-react').then(module => ({ default: module.IconTrash })));
  const IconSearch = lazy(() => import('@tabler/icons-react').then(module => ({ default: module.IconSearch })));
  const IconCheck = lazy(() => import('@tabler/icons-react').then(module => ({ default: module.IconCheck })));
  const IconX = lazy(() => import('@tabler/icons-react').then(module => ({ default: module.IconX })));
  
  // Icon wrapper component
  const IconWrapper = ({ icon: Icon, ...props }) => (
    <Suspense fallback={<span style={{ width: props.size, height: props.size }} />}>
      <Icon {...props} />
    </Suspense>
  );
  
  const MOCK_DATA = [
    { 
      id: 1, 
      name: 'Nguyễn Văn X', 
      email: 'nguyenvanx@gmail.com',
      phone: '0123456789',
      status: 'active',
      contributions: 5,
      lastContribution: '2024-02-20T15:30:45'
    },
    { 
      id: 2, 
      name: 'Trần Thị Y', 
      email: 'tranthy@gmail.com',
      phone: '0987654321',
      status: 'pending',
      contributions: 2,
      lastContribution: '2024-02-19T09:15:22'
    },
  ];
  
  export default function ContributorsManage() {
    const [opened, { open, close }] = useDisclosure(false);
    const [editingContributor, setEditingContributor] = useState(null);
    const [contributors, setContributors] = useState(MOCK_DATA);
    const [search, setSearch] = useState('');
  
    const handleAdd = () => {
      setEditingContributor(null);
      open();
    };
  
    const handleEdit = (contributor) => {
      setEditingContributor(contributor);
      open();
    };
  
    const handleDelete = (id) => {
      if (window.confirm('Bạn có chắc muốn xóa người đóng góp này?')) {
        setContributors(contributors.filter(c => c.id !== id));
      }
    };
  
    const handleStatusChange = (id, newStatus) => {
      setContributors(contributors.map(c => 
        c.id === id ? { ...c, status: newStatus } : c
      ));
    };
  
    const filteredContributors = contributors.filter(contributor => 
      contributor.name.toLowerCase().includes(search.toLowerCase()) ||
      contributor.email.toLowerCase().includes(search.toLowerCase())
    );
  
    const getStatusBadge = (status) => {
      const statusConfig = {
        active: { color: 'green', label: 'Đang hoạt động' },
        pending: { color: 'yellow', label: 'Chờ duyệt' },
        blocked: { color: 'red', label: 'Đã khóa' }
      };
      const config = statusConfig[status];
      return <Badge color={config.color}>{config.label}</Badge>;
    };
  
    return (
      <>
        <Group justify="space-between" mb="lg">
          <Title order={2}>Quản lý người đóng góp</Title>
          <Button 
            leftSection={<IconWrapper icon={IconPlus} size={14} />}
            onClick={handleAdd}
          >
            Thêm người đóng góp
          </Button>
        </Group>
  
        <TextInput
          placeholder="Tìm kiếm theo tên hoặc email..."
          mb="md"
          leftSection={<IconWrapper icon={IconSearch} size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
  
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Họ và tên</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Số điện thoại</Table.Th>
              <Table.Th>Trạng thái</Table.Th>
              <Table.Th>Số đóng góp</Table.Th>
              <Table.Th>Lần cuối</Table.Th>
              <Table.Th style={{ width: 80 }}>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredContributors.map((contributor) => (
              <Table.Tr key={contributor.id}>
                <Table.Td>{contributor.name}</Table.Td>
                <Table.Td>{contributor.email}</Table.Td>
                <Table.Td>{contributor.phone}</Table.Td>
                <Table.Td>{getStatusBadge(contributor.status)}</Table.Td>
                <Table.Td>{contributor.contributions}</Table.Td>
                <Table.Td>
                  {contributor.lastContribution ? (
                    <>
                      {new Date(contributor.lastContribution).toLocaleDateString('vi-VN')}
                      {' '}
                      {new Date(contributor.lastContribution).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </>
                  ) : (
                    'Chưa có'
                  )}
                </Table.Td>
                <Table.Td>
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <IconWrapper icon={IconDots} size={16} />
                      </ActionIcon>
                    </Menu.Target>
  
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconWrapper icon={IconEdit} size={14} />}
                        onClick={() => handleEdit(contributor)}
                      >
                        Chỉnh sửa
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconWrapper icon={IconCheck} size={14} />}
                        onClick={() => handleStatusChange(contributor.id, 'active')}
                        disabled={contributor.status === 'active'}
                      >
                        Phê duyệt
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        leftSection={<IconWrapper icon={IconX} size={14} />}
                        onClick={() => handleStatusChange(contributor.id, 'blocked')}
                        disabled={contributor.status === 'blocked'}
                      >
                        Khóa
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        leftSection={<IconWrapper icon={IconTrash} size={14} />}
                        onClick={() => handleDelete(contributor.id)}
                      >
                        Xóa
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
  
        <Modal 
          opened={opened} 
          onClose={close} 
          title={editingContributor ? "Chỉnh sửa thông tin người đóng góp" : "Thêm người đóng góp mới"}
        >
          <ContributorForm 
            initialData={editingContributor}
            onSubmit={(data) => {
              if (editingContributor) {
                setContributors(contributors.map(c => 
                  c.id === editingContributor.id ? { ...c, ...data } : c
                ));
              } else {
                setContributors([
                  ...contributors, 
                  { 
                    id: Date.now(), 
                    ...data, 
                    status: 'pending',
                    contributions: 0,
                    lastContribution: new Date().toISOString()
                  }
                ]);
              }
              close();
            }}
          />
        </Modal>
      </>
    );
  }
  
  function ContributorForm({ initialData, onSubmit }) {
    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      onSubmit({
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        status: formData.get('status') || initialData?.status || 'pending'
      });
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Họ và tên"
            name="name"
            required
            defaultValue={initialData?.name}
          />
          <TextInput
            label="Email"
            name="email"
            type="email"
            required
            defaultValue={initialData?.email}
          />
          <TextInput
            label="Số điện thoại"
            name="phone"
            required
            defaultValue={initialData?.phone}
          />
          {initialData && (
            <Select
              label="Trạng thái"
              name="status"
              defaultValue={initialData.status}
              data={[
                { value: 'active', label: 'Đang hoạt động' },
                { value: 'pending', label: 'Chờ duyệt' },
                { value: 'blocked', label: 'Đã khóa' }
              ]}
            />
          )}
          <Button type="submit">
            {initialData ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Stack>
      </form>
    );
  } 