import { Paper, Text, Button, Group, Stack } from "@mantine/core";
import { BiSolidInfoCircle } from "react-icons/bi";
import { MdDirections } from "react-icons/md";

const MartyrBriefInfo = ({ martyr, onViewDetail, onShowRoute }) => {
  if (!martyr) return null;

  return (
    <Paper
      className="fixed bottom-0 w-full z-[4] rounded-t-2xl shadow-md"
      shadow="sm"
      p="sm"
      pt={"xl"}
      withBorder
    >
      <Stack spacing="md">
        <div>
          <div className="flex justify-start items-center gap-2">
            <Text size="24px" fw={700} className="text-gray-700 mb-2">
              LIỆT SĨ
            </Text>
            <Text size="24px" fw={700} className="text-blue-700 mb-2">
              {martyr.fullName}
            </Text>
          </div>

          <table className="w-full mb-0 border-collapse">
            <tr>
              <td className="border-2 p-3 text-center">
                <Text size="20px" fw={600} c="dark" className="tracking-wide">
                  KHU {martyr.graveRow?.areaName || "---"}
                </Text>
              </td>
              <td className="border-2 p-3 text-center">
                <Text size="20px" fw={600} c="dark" className="tracking-wide">
                  HÀNG {martyr.graveRow?.rowName || "---"}
                </Text>
              </td>
              <td className="border-2 p-3 text-center">
                <Text size="20px" fw={600} c="dark" className="tracking-wide">
                  MỘ {martyr.graveCode || "---"}
                </Text>
              </td>
            </tr>
          </table>
        </div>

        <Group grow spacing="sm">
          <Button
            size="xl"
            variant="filled"
            className="py-4"
            leftSection={<BiSolidInfoCircle size={24} />}
            onClick={onViewDetail}
          >
            Chi tiết
          </Button>
          <Button
            size="xl"
            color="green"
            className="py-4"
            leftSection={<MdDirections size={24} />}
            onClick={onShowRoute}
          >
            Chỉ đường
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
};

export default MartyrBriefInfo;
