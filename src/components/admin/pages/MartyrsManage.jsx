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
  NumberInput,
  Text,
  Image,
  FileInput,
  Center
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconDots, IconEdit, IconTrash, IconSearch, IconEyeCheck, IconEyeOff, IconUpload, IconPhoto } from '@tabler/icons-react';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

// Mock data - sau này sẽ thay bằng API call
const MOCK_DATA = [
  { 
    id: "LS001",
    createdAt: "2024-02-20T10:00:00",
    updatedAt: "2024-02-20T10:00:00",
    codeName: "LS_A123",
    commune: "Xã A",
    dateOfDeath: "1968-02-20",
    district: "Huyện X",
    fullName: "Nguyễn Văn A",   
    hometown: "An Giang",
    name: "Văn A",
    placeOfExhumation: "Địa điểm A",
    rankPositionUnit: "Chiến sĩ",
    rhyme: "Nguyễn",
    yearOfBirth: 1940,
    yearOfEnlistment: 1965,
    deleted: false,
    hidden: false,
    graveRow: "B1 - VH số 1",
    image: 'https://imagedelivery.net/ZeGtsGSjuQe1P3UP_zk3fQ/ede24b65-497e-4940-ea90-06cc2757a200/storedata',
  },
];

export default function MartyrsManage() {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [editingMartyr, setEditingMartyr] = useState(null);
  const [martyrs, setMartyrs] = useState(MOCK_DATA);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    setEditingMartyr(null);
    open();
  };

  const handleEdit = (martyr) => {
    setEditingMartyr(martyr);
    open();
  };

  const handleDelete = (id) => {
    // Thêm confirm dialog trước khi xóa
    if (window.confirm('Bạn có chắc muốn xóa liệt sĩ này?')) {
      setMartyrs(martyrs.filter(m => m.id !== id));
    }
  };

  const filteredMartyrs = martyrs.filter(martyr => 
    martyr.name.toLowerCase().includes(search.toLowerCase()) ||
    martyr.hometown.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      // Xử lý submit
      if (editingMartyr) {
        setMartyrs(martyrs.map(m => 
          m.id === editingMartyr.id ? { ...m, ...data } : m
        ));
      } else {
        setMartyrs([...martyrs, { id: Date.now(), ...data }]);
      }
      close();
      notifications.show({
        title: 'Thành công',
        message: editingMartyr ? 'Đã cập nhật thông tin liệt sĩ' : 'Đã thêm liệt sĩ mới',
        color: 'green'
      });
    } catch (error) {
      notifications.show({
        title: 'Lỗi',
        message: 'Có lỗi xảy ra, vui lòng thử lại',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Quản lý liệt sĩ</Title>
        <Button 
          leftSection={<IconPlus size={14} />}
          onClick={() => navigate('new')}
        >
          Thêm liệt sĩ
        </Button>
      </Group>

      <TextInput
        placeholder="Tìm kiếm theo tên hoặc quê quán..."
        mb="md"
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />

      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Ảnh</Table.Th>
            <Table.Th>Mã liệt sĩ</Table.Th>
            <Table.Th>Họ và tên</Table.Th>
            <Table.Th>Năm sinh</Table.Th>
            <Table.Th>Ngày hy sinh</Table.Th>
            <Table.Th>Quê quán</Table.Th>
            <Table.Th>Hàng mộ</Table.Th>
            <Table.Th>Trạng thái</Table.Th>
            <Table.Th style={{ width: 80 }}>Thao tác</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredMartyrs.map((martyr) => (
            <Table.Tr key={martyr.id}>
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
                {martyr.dateOfDeath ? new Date(martyr.dateOfDeath).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }) : ''}
              </Table.Td>
              <Table.Td>{`${martyr.hometown} - ${martyr.district}`}</Table.Td>
              <Table.Td>{martyr.graveRow}</Table.Td>
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
                      <IconDots size={16} />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item
                      leftSection={<IconEdit size={14} />}
                      onClick={() => navigate(`${martyr.id}`)}
                    >
                      Chỉnh sửa
                    </Menu.Item>
                    <Menu.Item
                      color="red"
                      leftSection={<IconTrash size={14} />}
                      onClick={() => handleDelete(martyr.id)}
                    >
                      Xóa
                    </Menu.Item>
                    <Menu.Item
                      leftSection={martyr.hidden ? <IconEyeCheck size={14} /> : <IconEyeOff size={14} />}
                      onClick={() => {
                        setMartyrs(martyrs.map(m => 
                          m.id === martyr.id ? { ...m, hidden: !m.hidden } : m
                        ));
                      }}
                    >
                      {martyr.hidden ? 'Hiển thị' : 'Ẩn'}
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
        onClose={loading ? undefined : close} 
        title={editingMartyr ? "Chỉnh sửa thông tin liệt sĩ" : "Thêm liệt sĩ mới"}
      >
        <MartyrForm 
          initialData={editingMartyr}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </Modal>
    </>
  );
}

// Component form thêm/sửa liệt sĩ
function MartyrForm({ initialData, onSubmit, loading }) {
  const [dateOfDeath, setDateOfDeath] = useState(
    initialData?.dateOfDeath ? new Date(initialData.dateOfDeath) : null
  );
  const [image, setImage] = useState(initialData?.image || null);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    try {
      const formData = new FormData(e.target);
      
      // Validate năm
      const yearOfBirth = parseInt(formData.get('yearOfBirth'));
      const yearOfEnlistment = parseInt(formData.get('yearOfEnlistment'));
      
      if (yearOfEnlistment < yearOfBirth) {
        setError('Năm nhập ngũ không thể nhỏ hơn năm sinh');
        return;
      }

      if (!dateOfDeath) {
        setError('Vui lòng chọn ngày hy sinh');
        return;
      }

      const deathYear = dateOfDeath.getFullYear();
      if (deathYear < yearOfEnlistment) {
        setError('Ngày hy sinh không thể trước năm nhập ngũ');
        return;
      }

      // Validate image size (2MB)
      if (image && image.size > 2 * 1024 * 1024) {
        setError('Kích thước ảnh không được vượt quá 2MB');
        return;
      }

      // Submit nếu pass hết validation
      onSubmit({
        id: initialData?.id || `LS${Date.now()}`,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        codeName: formData.get('codeName'),
        commune: formData.get('commune'),
        dateOfDeath: dateOfDeath?.toISOString().split('T')[0],
        district: formData.get('district'),
        fullName: formData.get('fullName'),
        hometown: formData.get('hometown'),
        name: formData.get('name'),
        placeOfExhumation: formData.get('placeOfExhumation'),
        rankPositionUnit: formData.get('rankPositionUnit'),
        rhyme: formData.get('rhyme'),
        yearOfBirth: parseInt(formData.get('yearOfBirth')),
        yearOfEnlistment: parseInt(formData.get('yearOfEnlistment')),
        deleted: false,
        hidden: false,
        graveRow: formData.get('graveRow'),
        image: image
      });
    } catch (err) {
      setError('Có lỗi xảy ra, vui lòng kiểm tra lại thông tin');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        {error && (
          <Text color="red" size="sm">
            {error}
          </Text>
        )}

        {/* Thêm preview ảnh nếu có */}
        {image && (
          <Center>
            <Image
              src={image}
              alt="Preview"
              width={200}
              height={200}
              radius="md"
              fit="cover"
            />
          </Center>
        )}

        <FileInput
          label="Ảnh liệt sĩ"
          description="Chọn ảnh định dạng JPG, PNG (tối đa 2MB)"
          accept="image/png,image/jpeg"
          leftSection={<IconPhoto size={16} />}
          placeholder="Chọn ảnh..."
          value={image}
          onChange={(file) => {
            if (file) {
              // Convert file to base64 for preview
              const reader = new FileReader();
              reader.onloadend = () => {
                setImage(reader.result);
              };
              reader.readAsDataURL(file);
            } else {
              setImage(null);
            }
          }}
          error={error}
        />

        <TextInput
          label="Mã liệt sĩ"
          name="codeName"
          required
          defaultValue={initialData?.codeName}
        />
        <Group grow>
          <TextInput
            label="Họ và tên đệm"
            name="rhyme"
            required
            defaultValue={initialData?.rhyme}
          />
          <TextInput
            label="Tên"
            name="name"
            required
            defaultValue={initialData?.name}
          />
        </Group>
        <TextInput
          label="Họ và tên đầy đủ"
          name="fullName"
          required
          defaultValue={initialData?.fullName}
        />
        <Group grow>
          <NumberInput
            label="Năm sinh"
            name="yearOfBirth"
            required
            defaultValue={initialData?.yearOfBirth}
            min={1900}
            max={2000}
          />
          <NumberInput
            label="Năm nhập ngũ"
            name="yearOfEnlistment"
            required
            defaultValue={initialData?.yearOfEnlistment}
            min={1900}
            max={2000}
          />
        </Group>
        <DateInput
          label="Ngày hy sinh"
          value={dateOfDeath}
          onChange={setDateOfDeath}
          required
          locale="vi"
          maxDate={new Date()}
          valueFormat="DD/MM/YYYY"
        />
        <TextInput
          label="Cấp bậc/Chức vụ/Đơn vị"
          name="rankPositionUnit"
          required
          defaultValue={initialData?.rankPositionUnit}
        />
        <Group grow>
          <TextInput
            label="Quê quán"
            name="hometown"
            required
            defaultValue={initialData?.hometown}
          />
          <TextInput
            label="Xã/Phường"
            name="commune"
            required
            defaultValue={initialData?.commune}
          />
          <TextInput
            label="Quận/Huyện"
            name="district"
            required
            defaultValue={initialData?.district}
          />
        </Group>
        <TextInput
          label="Nơi quy tập"
          name="placeOfExhumation"
          required
          defaultValue={initialData?.placeOfExhumation}
        />
        <TextInput
          label="Hàng mộ"
          name="graveRow"
          required
          defaultValue={initialData?.graveRow}
        />
        <Button type="submit" loading={loading}>
          {initialData ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </Stack>
    </form>
  );
} 