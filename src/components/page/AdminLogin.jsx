import {
  Center,
  Box,
  PasswordInput,
  Card,
  BackgroundImage,
} from "@mantine/core";
import { Button, Checkbox, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function AdminLoginPage() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email không hợp lệ"),
    },
  });
  return (
    <BackgroundImage src="https://scontent.iocvnpt.com/resources/portal/Images/DTP/linhln/thang_7/tap_chi_du_lich/1_325196302.jpg">
      <div className="h-screen w-full flex flex-col justify-center items-center">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <>
            <Center>
              <Box mb="lg">
                <span className="font-bold text-2xl text-blue-600">HeroVN</span>
              </Box>
            </Center>
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
              <TextInput
                withAsterisk
                label="Tên đăng nhập"
                placeholder="Tên đăng nhập của bạn"
                key={form.key("email")}
                {...form.getInputProps("email")}
              />

              <PasswordInput
                label="Mật khẩu"
                withAsterisk
                placeholder="Mật khẩu của bạn"
              />

              <Checkbox
                mt="md"
                label="Lưu đăng nhập"
                key={form.key("remember")}
              />

              <Group justify="center" mt="md">
                <Button type="submit">Đăng nhập</Button>
              </Group>
            </form>
          </>
        </Card>
      </div>
    </BackgroundImage>
  );
}
