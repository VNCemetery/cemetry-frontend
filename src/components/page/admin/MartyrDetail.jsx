import { 
    Container,
    Paper,
    Title,
    Group,
    Button,
    Stack,
    TextInput,
    NumberInput,
    Image,
    FileInput,
    Center,
    Text,
    Divider,
    ActionIcon,
    Tooltip
  } from '@mantine/core';
  import { DateInput } from '@mantine/dates';
  import { lazy, Suspense } from 'react';
  import { useNavigate, useParams } from 'react-router-dom';
  import { notifications } from '@mantine/notifications';
  
  // Lazy load icons
  const IconArrowLeft = lazy(() => import('@tabler/icons-react').then(module => ({ default: module.IconArrowLeft })));
  const IconPhoto = lazy(() => import('@tabler/icons-react').then(module => ({ default: module.IconPhoto })));
  const IconDeviceFloppy = lazy(() => import('@tabler/icons-react').then(module => ({ default: module.IconDeviceFloppy })));
  const IconTrash = lazy(() => import('@tabler/icons-react').then(module => ({ default: module.IconTrash })));
  
  // Icon wrapper
  const IconWrapper = ({ icon: Icon, ...props }) => (
    <Suspense fallback={<span style={{ width: props.size, height: props.size }} />}>
      <Icon {...props} />
    </Suspense>
  );
  
  export default function MartyrDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Giả lập lấy data từ API
    const [martyr, setMartyr] = useState(() => {
      // Tìm liệt sĩ theo id từ MOCK_DATA
      return {
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
        graveRow: "A12",
        image: null,
      };
    });
  
    const [dateOfDeath, setDateOfDeath] = useState(
      martyr?.dateOfDeath ? new Date(martyr.dateOfDeath) : null
    );
    const [image, setImage] = useState(martyr?.image || null);
    const [error, setError] = useState(null);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
  
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
  
        // Tạo object data mới
        const updatedMartyr = {
          ...martyr,
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
          yearOfBirth: yearOfBirth,
          yearOfEnlistment: yearOfEnlistment,
          graveRow: formData.get('graveRow'),
          image: image,
          updatedAt: new Date().toISOString()
        };
  
        // Call API update
        await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
        setMartyr(updatedMartyr);
        
        notifications.show({
          title: 'Thành công',
          message: 'Đã cập nhật thông tin liệt sĩ',
          color: 'green'
        });
  
      } catch (err) {
        setError('Có lỗi xảy ra, vui lòng thử lại');
        notifications.show({
          title: 'Lỗi',
          message: 'Không thể cập nhật thông tin',
          color: 'red'
        });
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Container size="xl">
        <Paper shadow="xs" p="md">
          <Group justify="space-between" mb="lg">
            <Group>
              <Tooltip label="Quay lại">
                <ActionIcon 
                  variant="subtle" 
                  onClick={() => navigate('/admin/martyrs')}
                >
                  <IconWrapper icon={IconArrowLeft} />
                </ActionIcon>
              </Tooltip>
              <Title order={2}>
                {id ? 'Chỉnh sửa thông tin liệt sĩ' : 'Thêm liệt sĩ mới'}
              </Title>
            </Group>
            <Group>
              <Button
                variant="light"
                color="red"
                leftSection={<IconWrapper icon={IconTrash} size={16} />}
                onClick={() => {
                  if (window.confirm('Bạn có chắc muốn xóa liệt sĩ này?')) {
                    // Xử lý xóa
                    navigate('/admin/martyrs');
                  }
                }}
              >
                Xóa
              </Button>
              <Button
                type="submit"
                form="martyr-form"
                loading={loading}
                leftSection={<IconWrapper icon={IconDeviceFloppy} size={16} />}
              >
                Lưu thay đổi
              </Button>
            </Group>
          </Group>
  
          <Divider mb="lg" />
  
          <form id="martyr-form" onSubmit={handleSubmit}>
            <Stack>
              {error && (
                <Text color="red" size="sm">
                  {error}
                </Text>
              )}
  
              <Group align="flex-start">
                {/* Cột trái - Ảnh */}
                <Stack style={{ width: 200 }}>
                  {image ? (
                    <Image
                      src={image}
                      alt="Preview"
                      radius="md"
                      h={250}
                      fit="cover"
                    />
                  ) : (
                    <Center h={250} bg="gray.1" style={{ border: '1px dashed gray' }}>
                      <IconWrapper icon={IconPhoto} size={32} color="gray" />
                    </Center>
                  )}
                  <FileInput
                    label="Ảnh liệt sĩ"
                    description="Chọn ảnh JPG, PNG (tối đa 2MB)"
                    accept="image/png,image/jpeg"
                    leftSection={<IconWrapper icon={IconPhoto} size={14} />}
                    placeholder="Chọn ảnh..."
                    value={image}
                    onChange={(file) => {
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImage(reader.result);
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setImage(null);
                      }
                    }}
                  />
                </Stack>
  
                {/* Cột phải - Form thông tin */}
                <Stack style={{ flex: 1 }}>
                  <TextInput
                    label="Mã liệt sĩ"
                    name="codeName"
                    required
                    defaultValue={martyr?.codeName}
                  />
                  
                  <Group grow>
                    <TextInput
                      label="Họ và tên đệm"
                      name="rhyme"
                      required
                      defaultValue={martyr?.rhyme}
                    />
                    <TextInput
                      label="Tên"
                      name="name"
                      required
                      defaultValue={martyr?.name}
                    />
                  </Group>
                  
                  <TextInput
                    label="Họ và tên đầy đủ"
                    name="fullName"
                    required
                    defaultValue={martyr?.fullName}
                  />
                  
                  <Group grow>
                    <NumberInput
                      label="Năm sinh"
                      name="yearOfBirth"
                      required
                      defaultValue={martyr?.yearOfBirth}
                      min={1900}
                      max={2000}
                    />
                    <NumberInput
                      label="Năm nhập ngũ"
                      name="yearOfEnlistment"
                      required
                      defaultValue={martyr?.yearOfEnlistment}
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
                    defaultValue={martyr?.rankPositionUnit}
                  />
                  
                  <Group grow>
                    <TextInput
                      label="Quê quán"
                      name="hometown"
                      required
                      defaultValue={martyr?.hometown}
                    />
                    <TextInput
                      label="Xã/Phường"
                      name="commune"
                      required
                      defaultValue={martyr?.commune}
                    />
                    <TextInput
                      label="Quận/Huyện"
                      name="district"
                      required
                      defaultValue={martyr?.district}
                    />
                  </Group>
                  
                  <TextInput
                    label="Nơi quy tập"
                    name="placeOfExhumation"
                    required
                    defaultValue={martyr?.placeOfExhumation}
                  />
                  
                  <TextInput
                    label="Hàng mộ"
                    name="graveRow"
                    required
                    defaultValue={martyr?.graveRow}
                  />
                </Stack>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Container>
    );
  } 