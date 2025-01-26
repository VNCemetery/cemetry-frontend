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
  Tooltip,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import {
  getMartyrById,
  updateMartyr,
} from "../../../services/martyrManagementService";
import { FiArrowLeft, FiImage, FiSave, FiTrash2 } from "react-icons/fi";
import { uploadImage } from "../../../services/imageService";

export default function MartyrDetail({ martyr: initialMartyr, onSave, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [martyr, setMartyr] = useState(initialMartyr || null);
  const [dateOfDeath, setDateOfDeath] = useState(null);
  const [image, setImage] = useState(initialMartyr?.image || null);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.target);

      // Validate các trường bắt buộc
      const requiredFields = [
        { field: "fullName", label: "Họ và tên đầy đủ" }
      ];
      
      const missingFields = requiredFields.filter(
        ({ field }) => !formData.get(field)
      );

      if (missingFields.length > 0) {
        notifications.show({
          title: "Lỗi",
          message: `Vui lòng điền: ${missingFields.map(f => f.label).join(", ")}`,
          color: "red"
        });
        setError("Vui lòng điền đầy đủ các trường bắt buộc");
        setLoading(false);
        return;
      }

      // Validate năm sinh và năm nhập ngũ
      const yearOfBirth = formData.get("yearOfBirth")
        ? parseInt(formData.get("yearOfBirth"))
        : null;
      const yearOfEnlistment = formData.get("yearOfEnlistment")
        ? parseInt(formData.get("yearOfEnlistment"))
        : null;

      if (yearOfBirth && (yearOfBirth < 1900 || yearOfBirth > new Date().getFullYear())) {
        notifications.show({
          title: "Lỗi",
          message: "Năm sinh không hợp lệ (phải từ 1900 đến hiện tại)",
          color: "red"
        });
        setLoading(false);
        return;
      }

      if (yearOfBirth && yearOfEnlistment && yearOfEnlistment < yearOfBirth) {
        notifications.show({
          title: "Lỗi",
          message: "Năm nhập ngũ không thể nhỏ hơn năm sinh",
          color: "red"
        });
        setError("Năm nhập ngũ không thể nhỏ hơn năm sinh");
        setLoading(false);
        return;
      }

      // Validate ngày hy sinh
      if (dateOfDeath) {
        if (yearOfBirth && dateOfDeath.getFullYear() < yearOfBirth) {
          notifications.show({
            title: "Lỗi",
            message: "Ngày hy sinh không thể trước năm sinh",
            color: "red"
          });
          setLoading(false);
          return;
        }

        if (yearOfEnlistment && dateOfDeath.getFullYear() < yearOfEnlistment) {
          notifications.show({
            title: "Lỗi",
            message: "Ngày hy sinh không thể trước năm nhập ngũ",
            color: "red"
          });
          setLoading(false);
          return;
        }
      }

      // Upload ảnh
      let imageUrl = image;
      if (imageFile) {
        try {
          const uploadResponse = await uploadImage(imageFile);
          imageUrl = uploadResponse.url;
        } catch (error) {
          notifications.show({
            title: "Lỗi",
            message: "Không thể tải lên ảnh. Vui lòng thử lại",
            color: "red"
          });
          setLoading(false);
          return;
        }
      }

      // Tạo object data
      const data = {
        codeName: formData.get("codeName"),
        fullName: formData.get("fullName"),
        name: formData.get("name") || null,
        rhyme: formData.get("rhyme") || null,
        yearOfBirth: yearOfBirth,
        yearOfEnlistment: yearOfEnlistment,
        dateOfDeath: formData.get("dateOfDeath") || null,
        graveRowId: martyr.graveRow.id,
        rankPositionUnit: formData.get("rankPositionUnit") || null,
        homeTown: formData.get("homeTown") || null,
        commune: formData.get("commune") || null,
        district: formData.get("district") || null,
        placeOfExhumation: formData.get("placeOfExhumation") || null,
        image: imageUrl,
      };

      if (martyr.id) {
        data.id = martyr.id;
      }

      await updateMartyr(martyr.id, data);

      notifications.show({
        title: "Thành công",
        message: "Đã cập nhật thông tin liệt sĩ",
        color: "green",
      });

      onSave();
    } catch (error) {
      console.error("Error:", error);
      
      // Hiển thị lỗi chi tiết
      let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Nếu có nhiều lỗi validation
        errorMessage = Object.values(error.response.data.errors)
          .flat()
          .join("\n");
      }

      notifications.show({
        title: "Lỗi",
        message: errorMessage,
        color: "red",
      });
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xl">
      <Paper shadow="xs" p="md">
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
                  <Center
                    h={250}
                    bg="gray.1"
                    style={{ border: "1px dashed gray" }}
                  >
                    <FiImage size={32} color="gray" />
                  </Center>
                )}
                <FileInput
                  label="Ảnh liệt sĩ"
                  description="Chọn ảnh JPG, PNG (tối đa 2MB)"
                  accept="image/png,image/jpeg"
                  leftSection={<FiImage size={14} />}
                  placeholder="Chọn ảnh..."
                  value={imageFile}
                  onChange={(file) => {
                    setImageFile(file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImage(reader.result); // For preview only
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
                  label="Họ và tên đầy đủ"
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

                <TextInput
                  label="Bí danh"
                  name="codeName"
                  defaultValue={martyr?.codeName}
                />

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

                <TextInput
                  label="Ngày hy sinh"
                  name="dateOfDeath"
                  placeholder="DD/MM/YYYY"
                  defaultValue={martyr?.dateOfDeath}
                />

                <TextInput
                  label="Cấp bậc/Chức vụ/Đơn vị"
                  name="rankPositionUnit"
                  defaultValue={martyr?.rankPositionUnit}
                />

                <Group grow>
                  <TextInput
                    label="Quê quán"
                    name="homeTown"
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
              </Stack>
            </Group>
          </Stack>
        </form>
        <Group position="right" mt="md">
          <Button variant="light" onClick={onCancel}>
            Hủy
          </Button>
          <Button 
            type="submit" 
            form="martyr-form"
            loading={loading}
            leftSection={<FiSave size={16} />}
          >
            Lưu thay đổi
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
