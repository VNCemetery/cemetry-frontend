import {
  Container,
  Grid,
  Skeleton,
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Table,
  ScrollArea,
  Stack,
} from "@mantine/core";
import MartyrInfoCard from "./MartyrInfoCard";
import { BiDirections, BiMap, BiNote } from "react-icons/bi";
import { FaDirections } from "react-icons/fa";
import { BsFillPersonFill } from "react-icons/bs";
import { MdMilitaryTech } from "react-icons/md";
import { IoLocation } from "react-icons/io5";

export default function MartyrDetail({ martyr, onRoute }) {
  return (
    <div className="h-screen w-full p-4">
      <div className="h-full w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* First Column */}
        <div className="p-4 rounded-lg border-2 border-gray-300 shadow-lg bg-white">
          <MartyrInfoCard {...martyr} />
        </div>

        {/* Second Column */}
        <div className="flex flex-col gap-4 items-center justify-center p-6 rounded-lg border-2 border-gray-300 shadow-lg bg-white">
          <Text className="text-3xl font-black mb-4 text-blue-900">
            NƠI AN NGHỈ
          </Text>
          <Table
            highlightOnHover
            withColumnBorders
            variant="vertical"
            layout="fixed"
            withTableBorder
            className="text-2xl"
            styles={{
              th: { padding: "16px", background: "#f8f9fa", fontSize: "22px" },
              td: { padding: "16px", fontSize: "22px" },
            }}
          >
            <Table.Tbody>
              <Table.Tr>
                <Table.Th w={160}>KHU</Table.Th>
                <Table.Td>{martyr.graveRow.areaName}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Th>HÀNG</Table.Th>
                <Table.Td>{martyr.graveRow.rowName}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Th>MỘ</Table.Th>
                <Table.Td>{martyr.graveCode}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <Button
            onClick={() => onRoute()}
            rightSection={<FaDirections size={24} />}
            size="xl"
            className="w-full mt-4 text-2xl py-4"
            styles={{ root: { height: "60px" } }}
          >
            CHỈ ĐƯỜNG
          </Button>
        </div>

        {/* Third Column */}
        <div className="flex flex-col gap-6">
          {[
            "THÔNG TIN CÁ NHÂN",
            "THÔNG TIN QUÂN NGŨ",
            "THÔNG TIN ĐỊA LÝ",
            "GHI CHÚ THÊM",
          ].map((title, index) => (
            <Card
              key={index}
              className="border-2 border-gray-300 shadow-lg bg-white p-4"
            >
              <Group mb="lg">
                {index === 0 && <BsFillPersonFill size={32} />}
                {index === 1 && <MdMilitaryTech size={32} />}
                {index === 2 && <IoLocation size={32} />}
                {index === 3 && <BiNote size={32} />}
                <Text className="text-2xl font-bold text-blue-900">
                  {title}
                </Text>
              </Group>
              <Table
                withBorder
                withColumnBorders
                styles={{
                  th: {
                    padding: "16px",
                    background: "#f8f9fa",
                    fontSize: "20px",
                    whiteSpace: "nowrap",
                  },
                  td: { padding: "16px", fontSize: "20px" },
                }}
              >
                {index === 0 && (
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Th>Tên thường gọi</Table.Th>
                      <Table.Td>{martyr.name || "Không có thông tin"}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th>Bí danh</Table.Th>
                      <Table.Td>
                        {martyr.codeName || "Không có thông tin"}
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                )}
                {index === 1 && (
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Th>Ngày nhập ngũ</Table.Th>
                      <Table.Td>
                        {martyr.dateOfEnlistment || "Không có thông tin"}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th>Chức vụ - Đơn vị</Table.Th>
                      <Table.Td>
                        {martyr.rankPositionUnit || "Không có thông tin"}
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                )}
                {index === 2 && (
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Th>Nơi quy tập</Table.Th>
                      <Table.Td>
                        {martyr.placeOfExhumation || "Không có thông tin"}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th>Địa chỉ chi tiết</Table.Th>
                      <Table.Td>
                        {[martyr.commune, martyr.district]
                          .filter(Boolean)
                          .join(", ") || "Không có thông tin"}
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                )}
                {index === 3 && (
                  <Text fz="md" c={martyr.note ? "dark" : "dimmed"}>
                    {martyr.note || "Không có ghi chú thêm"}
                  </Text>
                )}
              </Table>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
