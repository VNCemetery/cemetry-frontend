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
  import { lazy, Suspense, useEffect, useState } from 'react';
  import { useNavigate, useParams } from 'react-router-dom';
  import { notifications } from '@mantine/notifications';
  import { getMartyrById, updateMartyr } from '../../../services/martyrManagementService';
  
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
    const [martyr, setMartyr] = useState(null);
    const [dateOfDeath, setDateOfDeath] = useState(null);
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
  
    // Load data khi component mount
    useEffect(() => {
      const loadMartyr = async () => {
        if (!id) return;
        try {
          setLoading(true);
          const data = await getMartyrById(id);
          setMartyr(data);
          setDateOfDeath(data.dateOfDeath ? new Date(data.dateOfDeath) : null);
          setImage(data.image);
        } catch (error) {
          notifications.show({
            title: 'Lỗi',
            message: 'Không thể tải thông tin liệt sĩ',
            color: 'red'
          });
        } finally {
          setLoading(false);
        }
      };
  
      loadMartyr();
    }, [id]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
  
      try {
        const formData = new FormData(e.target);
        
        // Validate các trường bắt buộc
        const requiredFields = ['codeName', 'fullName'];
        const missingFields = requiredFields.filter(field => !formData.get(field));
        
        if (missingFields.length > 0) {
          setError('Vui lòng điền đầy đủ các trường bắt buộc');
          setLoading(false);
          return;
        }
  
        // Validate năm nếu có nhập
        const yearOfBirth = formData.get('yearOfBirth') ? parseInt(formData.get('yearOfBirth')) : null;
        const yearOfEnlistment = formData.get('yearOfEnlistment') ? parseInt(formData.get('yearOfEnlistment')) : null;
        
        if (yearOfBirth && yearOfEnlistment && yearOfEnlistment < yearOfBirth) {
          setError('Năm nhập ngũ không thể nhỏ hơn năm sinh');
          setLoading(false);
          return;
        }
  
        if (dateOfDeath && yearOfEnlistment && dateOfDeath.getFullYear() < yearOfEnlistment) {
          setError('Ngày hy sinh không thể trước năm nhập ngũ');
          setLoading(false);
          return;
        }
  
        // Tạo object data
        const data = {
          codeName: formData.get('codeName'), // Bắt buộc
          fullName: formData.get('fullName'), // Bắt buộc
          name: formData.get('name') || null,
          rhyme: formData.get('rhyme') || null,
          yearOfBirth: yearOfBirth,
          yearOfEnlistment: yearOfEnlistment,
          dateOfDeath: dateOfDeath,
          rankPositionUnit: formData.get('rankPositionUnit') || null,
          hometown: formData.get('hometown') || null,
          commune: formData.get('commune') || null,
          district: formData.get('district') || null,
          placeOfExhumation: formData.get('placeOfExhumation') || null,
          graveRow: formData.get('graveRow') || null,
        };
  
        // Chỉ thêm id nếu đang trong chế độ edit
        if (id) {
          data.id = id;
        }
  
        // Thêm ảnh nếu có
        if (image instanceof File) {
          data.image = image;
        }
  
        await updateMartyr(id, data);
        
        notifications.show({
          title: 'Thành công',
          message: id ? 'Đã cập nhật thông tin liệt sĩ' : 'Đã thêm liệt sĩ mới',
          color: 'green'
        });
  
        navigate('/admin/martyrs');
      } catch (error) {
        console.error('Error:', error); // Thêm log để debug
        notifications.show({
          title: 'Lỗi',
          message: error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
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
                    label="Mã liệt sĩ *"
                    name="codeName"
                    required
                    defaultValue={martyr?.codeName}
                  />
                  
                  <TextInput
                    label="Họ và tên đầy đủ *"
                    name="fullName"
                    required
                    defaultValue={martyr?.fullName}
                  />
                  
                  <Group grow>
                    <TextInput
                      label="Họ và tên đệm"
                      name="rhyme"
                      defaultValue={martyr?.rhyme}
                    />
                    <TextInput
                      label="Tên"
                      name="name"
                      defaultValue={martyr?.name}
                    />
                  </Group>
                  
                  <Group grow>
                    <NumberInput
                      label="Năm sinh"
                      name="yearOfBirth"
                      defaultValue={martyr?.yearOfBirth}
                      min={1900}
                      max={2000}
                    />
                    <NumberInput
                      label="Năm nhập ngũ"
                      name="yearOfEnlistment"
                      defaultValue={martyr?.yearOfEnlistment}
                      min={1900}
                      max={2000}
                    />
                  </Group>
                  
                  <DateInput
                    label="Ngày hy sinh"
                    value={dateOfDeath}
                    onChange={setDateOfDeath}
                    locale="vi"
                    maxDate={new Date()}
                    valueFormat="DD/MM/YYYY"
                  />
                  
                  <TextInput
                    label="Cấp bậc/Chức vụ/Đơn vị"
                    name="rankPositionUnit"
                    defaultValue={martyr?.rankPositionUnit}
                  />
                  
                  <Group grow>
                    <TextInput
                      label="Quê quán"
                      name="hometown"
                      defaultValue={martyr?.hometown}
                    />
                    <TextInput
                      label="Xã/Phường"
                      name="commune"
                      defaultValue={martyr?.commune}
                    />
                    <TextInput
                      label="Quận/Huyện"
                      name="district"
                      defaultValue={martyr?.district}
                    />
                  </Group>
                  
                  <TextInput
                    label="Nơi quy tập"
                    name="placeOfExhumation"
                    defaultValue={martyr?.placeOfExhumation}
                  />
                  
                  <TextInput
                    label="Hàng mộ"
                    name="graveRow"
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