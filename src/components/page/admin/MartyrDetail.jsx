import { 
    Paper,
    Title,
    TextInput,
    NumberInput,
  Button, 
  Group, 
  Stack,
  FileInput,
    Image,
    Text,
  LoadingOverlay,
  Switch
  } from '@mantine/core';
  import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
  import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { IconPhoto, IconUpload } from '@tabler/icons-react';
import { getMartyrById, upsertMartyr } from '../../../services/martyrService';
  
  export default function MartyrDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const isNew = !id || id === 'new';

  const form = useForm({
    initialValues: {
      id: '',
        image: null,
      fullName: '',
      name: '',
      codeName: '',
      yearOfBirth: '',
      dateOfEnlistment: null,
      dateOfDeath: null,
      rankPositionUnit: '',
      homeTown: '',
      placeOfExhumation: '',
      note: '',
      commune: '',
      district: '',
      graveRowId: '',
      isHidden: false
    },

    validate: {
      fullName: (value) => (!value ? 'Vui lòng nhập họ tên đầy đủ' : null),
      name: (value) => (!value ? 'Vui lòng nhập tên' : null),
      codeName: (value) => (!value ? 'Vui lòng nhập mã liệt sĩ' : null),
      yearOfBirth: (value) => {
        if (!value) return 'Vui lòng nhập năm sinh';
        if (value < 1900 || value > 2000) return 'Năm sinh không hợp lệ';
        return null;
      },
      dateOfDeath: (value) => {
        if (!value) return 'Vui lòng nhập ngày hy sinh';
        if (value > new Date()) return 'Ngày hy sinh không thể lớn hơn ngày hiện tại';
        return null;
      },
      homeTown: (value) => (!value ? 'Vui lòng nhập quê quán' : null),
    },

    transformValues: (values) => ({
      ...values,
      dateOfEnlistment: values.dateOfEnlistment ? values.dateOfEnlistment.toISOString() : null,
      dateOfDeath: values.dateOfDeath ? values.dateOfDeath.toISOString() : null,
      yearOfBirth: values.yearOfBirth ? parseInt(values.yearOfBirth) : null,
      graveRowId: values.graveRowId ? parseInt(values.graveRowId) : null
    })
  });

  useEffect(() => {
    if (!isNew) {
      loadMartyrData();
    }
  }, [id]);

  const loadMartyrData = async () => {
    try {
      setLoading(true);
      const data = await getMartyrById(id);
      if (!data) {
        throw new Error('Không tìm thấy thông tin liệt sĩ');
      }
      const formattedData = {
        ...data,
        dateOfEnlistment: data.dateOfEnlistment ? new Date(data.dateOfEnlistment) : null,
        dateOfDeath: data.dateOfDeath ? new Date(data.dateOfDeath) : null
      };
      form.setValues(formattedData);
      if (data.image) {
        setImagePreview(data.image);
      }
    } catch (error) {
      notifications.show({
        title: 'Lỗi',
        message: error.message || 'Không thể tải thông tin liệt sĩ',
        color: 'red'
      });
      navigate('/admin/martyrs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await upsertMartyr(values);
        notifications.show({
          title: 'Thành công',
        message: id === 'new' ? 'Đã thêm liệt sĩ mới' : 'Đã cập nhật thông tin liệt sĩ',
          color: 'green'
        });
      navigate('/admin/martyrs');
    } catch (error) {
        notifications.show({
          title: 'Lỗi',
        message: error.message || 'Có lỗi xảy ra, vui lòng thử lại',
          color: 'red'
        });
      } finally {
        setLoading(false);
      }
    };
  
    return (
    <Paper p="md" pos="relative">
      <LoadingOverlay visible={loading} />
      
      <Title order={2} mb="lg">
        {isNew ? 'Thêm liệt sĩ mới' : 'Cập nhật thông tin liệt sĩ'}
              </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="md">
          {imagePreview && (
                    <Image
              src={imagePreview}
                      alt="Preview"
              width={200}
              height={200}
                      radius="md"
              mx="auto"
                    />
                  )}

                  <FileInput
                    label="Ảnh liệt sĩ"
            accept="image/*"
                    placeholder="Chọn ảnh..."
            icon={<IconUpload size={14} />}
            {...form.getInputProps('image')}
                    onChange={(file) => {
              form.setFieldValue('image', file);
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                  setImagePreview(reader.result);
                        };
                        reader.readAsDataURL(file);
                      } else {
                setImagePreview(null);
                      }
                    }}
                  />
                  
                  <Group grow>
                    <TextInput
              label="Họ và tên đầy đủ"
                      required
              {...form.getInputProps('fullName')}
                    />
                    <TextInput
                      label="Tên"
                      required
              {...form.getInputProps('name')}
                    />
                  </Group>
                  
          <Group grow>
                  <TextInput
              label="Mã liệt sĩ"
                    required
              {...form.getInputProps('codeName')}
                  />
                    <NumberInput
                      label="Năm sinh"
                      required
                      min={1900}
                      max={2000}
              {...form.getInputProps('yearOfBirth')}
                    />
                  </Group>
                  
          <Group grow>
            <DateInput
              label="Ngày nhập ngũ"
              placeholder="Chọn ngày"
              valueFormat="DD/MM/YYYY"
              {...form.getInputProps('dateOfEnlistment')}
            />
                  <DateInput
                    label="Ngày hy sinh"
              placeholder="Chọn ngày"
                    required
                    valueFormat="DD/MM/YYYY"
              {...form.getInputProps('dateOfDeath')}
                  />
          </Group>
                  
                  <TextInput
                    label="Cấp bậc/Chức vụ/Đơn vị"
            {...form.getInputProps('rankPositionUnit')}
                  />
                  
                  <Group grow>
                    <TextInput
                      label="Quê quán"
                      required
              {...form.getInputProps('homeTown')}
                    />
                    <TextInput
                      label="Xã/Phường"
              {...form.getInputProps('commune')}
                    />
                    <TextInput
                      label="Quận/Huyện"
              {...form.getInputProps('district')}
                    />
                  </Group>
                  
                  <TextInput
                    label="Nơi quy tập"
            {...form.getInputProps('placeOfExhumation')}
                  />
                  
                  <TextInput
            label="Ghi chú"
            {...form.getInputProps('note')}
          />

          <Group grow>
            <TextInput
              label="Hàng mộ"
              type="number"
              {...form.getInputProps('graveRowId')}
            />
            <Switch
              label="Ẩn thông tin liệt sĩ"
              {...form.getInputProps('isHidden', { type: 'checkbox' })}
            />
          </Group>

          <Group justify="flex-end" mt="xl">
            <Button variant="light" onClick={() => navigate('/admin/martyrs')}>
              Hủy
            </Button>
            <Button type="submit" loading={loading}>
              {isNew ? 'Thêm mới' : 'Cập nhật'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
    );
  } 