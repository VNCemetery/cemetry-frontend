import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Text,
  Box,
  BackgroundImage,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/authService";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: {
      code: (value) => (value.length < 1 ? "Vui lòng nhập mã xác thực" : null),
      newPassword: (value) =>
        value.length < 6 ? "Mật khẩu phải có ít nhất 6 ký tự" : null,
      confirmPassword: (value, values) =>
        value !== values.newPassword ? "Mật khẩu không khớp" : null,
    },
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    setError("");
    try {
      await resetPassword(values.code, values.newPassword);
      navigate("/admin/login", {
        state: {
          message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.",
        },
      });
    } catch (error) {
      setError(
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundImage
      src="https://scontent.iocvnpt.com/resources/portal/Images/DTP/linhln/thang_7/tap_chi_du_lich/1_325196302.jpg"
      style={{ minHeight: "100vh" }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container size={420}>
          <Paper
            withBorder
            shadow="xl"
            p={30}
            radius="md"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <Box ta="center" mb={30}>
              <Title order={2} mb="xs">
                Đặt lại mật khẩu
              </Title>
              <Text c="dimmed" size="sm">
                Nhập mã xác thực và mật khẩu mới
              </Text>
            </Box>

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                label="Mã xác thực"
                placeholder="Nhập mã từ email"
                required
                {...form.getInputProps("code")}
              />

              <PasswordInput
                label="Mật khẩu mới"
                placeholder="Nhập mật khẩu mới"
                required
                mt="md"
                {...form.getInputProps("newPassword")}
              />

              <PasswordInput
                label="Xác nhận mật khẩu"
                placeholder="Nhập lại mật khẩu mới"
                required
                mt="md"
                {...form.getInputProps("confirmPassword")}
              />

              {error && (
                <Text c="red" size="sm" mt="sm">
                  {error}
                </Text>
              )}

              <Button fullWidth mt="xl" type="submit" loading={isLoading}>
                Đặt lại mật khẩu
              </Button>

              <Text ta="center" mt="md">
                <Link to="/admin/login" style={{ textDecoration: "none" }}>
                  Quay lại đăng nhập
                </Link>
              </Text>
            </form>
          </Paper>
        </Container>
      </div>
    </BackgroundImage>
  );
}
