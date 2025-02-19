import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Button,
  Text,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import {
  requestChangePassword,
  confirmChangePassword,
} from "../../../services/authService";
import { notifications } from "@mantine/notifications";

export default function ChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập mã và mật khẩu mới

  const emailForm = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email không hợp lệ"),
    },
  });

  const confirmForm = useForm({
    initialValues: {
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: {
      code: (value) => (value.length < 1 ? "Vui lòng nhập mã xác thực" : null),
      newPassword: (value) =>
        value.length < 6 ? "Mật khẩu mới phải có ít nhất 6 ký tự" : null,
      confirmPassword: (value, values) =>
        value !== values.newPassword ? "Mật khẩu không khớp" : null,
    },
  });

  const handleRequestCode = async (values) => {
    setIsLoading(true);
    try {
      await requestChangePassword(values.email);
      notifications.show({
        title: "Thành công",
        message: "Mã xác thực đã được gửi đến email của bạn",
        color: "green",
      });
      setStep(2);
    } catch (error) {
      notifications.show({
        title: "Lỗi",
        message:
          error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmChange = async (values) => {
    setIsLoading(true);
    try {
      await confirmChangePassword(values.code, values.newPassword);
      notifications.show({
        title: "Thành công",
        message: "Đổi mật khẩu thành công",
        color: "green",
      });
      // Reset forms và quay lại bước 1
      emailForm.reset();
      confirmForm.reset();
      setStep(1);
    } catch (error) {
      notifications.show({
        title: "Lỗi",
        message:
          error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper withborder shadow="sm" p="md" radius="md">
      <Title order={3} mb="md">
        Đổi mật khẩu
      </Title>

      {step === 1 ? (
        <form onSubmit={emailForm.onSubmit(handleRequestCode)}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="Nhập email của bạn"
              required
              {...emailForm.getInputProps("email")}
            />

            <Button type="submit" loading={isLoading}>
              Gửi mã xác thực
            </Button>
          </Stack>
        </form>
      ) : (
        <form onSubmit={confirmForm.onSubmit(handleConfirmChange)}>
          <Stack>
            <TextInput
              label="Mã xác thực"
              placeholder="Nhập mã từ email"
              required
              {...confirmForm.getInputProps("code")}
            />

            <PasswordInput
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              required
              {...confirmForm.getInputProps("newPassword")}
            />

            <PasswordInput
              label="Xác nhận mật khẩu mới"
              placeholder="Nhập lại mật khẩu mới"
              required
              {...confirmForm.getInputProps("confirmPassword")}
            />

            <Button.Group>
              <Button variant="default" onClick={() => setStep(1)}>
                Quay lại
              </Button>
              <Button type="submit" loading={isLoading}>
                Đổi mật khẩu
              </Button>
            </Button.Group>
          </Stack>
        </form>
      )}
    </Paper>
  );
}
