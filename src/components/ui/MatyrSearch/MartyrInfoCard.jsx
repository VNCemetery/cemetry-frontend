import { Avatar, Button, Card, Group, Text } from "@mantine/core";
import classes from "./MartyrInfoCard.module.css";
import { getImageUrl } from "../../../utils/imageUtils";


export default function MartyrInfoCard({
  fullName,
  homeTown,
  yearOfBirth,
  dateOfDeath,
  rankPositionUnit,
  image
}) {
  return (
    <Card radius="md" className="bg-white" p="xl" shadow="lg">
      {/* <Card.Section h={1R60} /> */}
      <Avatar
        size={120}
        radius={120}
        mx="auto"
        mt={-40}
        src={getImageUrl(image)}
        className={classes.avatar}
        styles={{
          root: {
            border: "4px solid white",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          },
        }}
      />
      <Text ta="center" mt="xl">
        <Text c="dark" fw={900} fz={28} mb={15} className="text-blue-900">
          LIỆT SĨ
        </Text>
        <Text c="blue.9" fw={900} fz={32} mb={20} className="text-blue-700">
          {fullName}
        </Text>

        {[
          { label: "CHỨC VỤ", value: rankPositionUnit },
          { label: "SINH NĂM", value: yearOfBirth },
          { label: "NGUYÊN QUÁN", value: homeTown },
          { label: "NGÀY HY SINH", value: dateOfDeath },
        ].map(({ label, value }) => (
          <Text
            key={label}
            c="dark"
            fz={22}
            fw={500}
            mb={15}
            className="bg-gray-50 p-3 rounded-lg"
          >
            {label}:{" "}
            <span style={{ fontWeight: 800 }}>
              {value || "CHƯA CÓ THÔNG TIN"}
            </span>
          </Text>
        ))}
      </Text>
    </Card>
  );
}
