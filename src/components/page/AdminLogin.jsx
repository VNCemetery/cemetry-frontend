import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Image,
  Text,
  Box,
  BackgroundImage,
  Group,
} from "@mantine/core";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useForm } from "@mantine/form";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) =>
        value.length < 1 ? "Vui lòng nhập tên đăng nhập" : null,
      password: (value) => (value.length < 1 ? "Vui lòng nhập mật khẩu" : null),
    },
  });

  const handleSubmit = async (values) => {
    try {
      console.log("Đang đăng nhập với:", values);
      const response = await login(values.username, values.password);
      console.log("Đăng nhập thành công:", response);
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
    }
  };

  return (
    <BackgroundImage
      src="https://scontent.iocvnpt.com/resources/portal/Images/DTP/linhln/thang_7/tap_chi_du_lich/1_325196302.jpg"
      style={{ minHeight: "100vh" }}
    >
      <div className="h-screen flex items-center bg-black bg-opacity-50">
        <Paper
          className="w-full md:w-1/2 lg:w-1/4 mx-auto"
          withborder
          shadow="xl"
          p={30}
          radius="md"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <Box ta="center" mb={30}>
            <Title order={2} mb="xs" style={{ color: "#1a1b1e" }}>
              HeroVN Admin
            </Title>
            <Text c="dimmed" size="sm">
              Vui lòng đăng nhập để tiếp tục
            </Text>
          </Box>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Tên đăng nhập"
              placeholder="Nhập tên đăng nhập"
              required
              {...form.getInputProps("username")}
            />
            <PasswordInput
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              required
              mt="md"
              {...form.getInputProps("password")}
            />

            {error && (
              <Text c="red" size="sm" mt="sm">
                {error}
              </Text>
            )}

            <Group position="apart" mt="md">
              <Link
                to="/admin/forgot-password"
                style={{ textDecoration: "none" }}
              >
                <Text size="sm">Quên mật khẩu?</Text>
              </Link>
            </Group>

            <Button fullWidth mt="xl" type="submit" loading={isLoading}>
              Đăng nhập
            </Button>
          </form>
        </Paper>
      </div>
    </BackgroundImage>
  );
}
