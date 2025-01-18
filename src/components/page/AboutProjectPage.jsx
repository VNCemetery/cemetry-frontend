import { Blockquote, Image, Title } from "@mantine/core";
import { FiGithub, FiHeart } from "react-icons/fi";
import InfoCard from "../ui/InfoCard";
import { FaTeamspeak } from "react-icons/fa";
import LOGO from "../../assets/SUPPORT_LOGO.png";

export default function AboutProjectPage() {
  const teamMembers = [
    {
      avatar_image_url: "https://avatars.githubusercontent.com/u/84840881?v=4",
      card_title: "Kỹ sư phần mềm",
      card_name: "Lê Hồng Phúc",
      card_role: "Quản lý dự án",
      socials: [
        {
          icon: <FiGithub />,
          link: "https://github.com/PhucLe0809",
          label: "PhucLe0809",
        },
      ],
    },
    {
      avatar_image_url: "https://avatars.githubusercontent.com/u/138989039?v=4",
      card_title: "Kỹ sư phần mềm",
      card_name: "Hồ Việt Anh",
      card_role: "Phát triển Frontend",
      socials: [
        {
          icon: <FiGithub />,
          link: "https://github.com/AndyAnh174",
          label: "AndyAnh174",
        },
      ],
    },
    {
      avatar_image_url: "https://avatars.githubusercontent.com/u/65480338?v=4",
      card_title: "Kỹ sư phần mềm",
      card_name: "Nguyễn Hữu Lộc",
      card_role: "Phát triển Backend",
      socials: [
        {
          icon: <FiGithub />,
          link: "https://github.com/lochuung",
          label: "lochuung",
        },
      ],
    },
    {
      avatar_image_url: "https://avatars.githubusercontent.com/u/60417892?v=4",
      card_title: "Kỹ sư phần mềm",
      card_name: "Trần Công Toản",
      card_role: "Thiết kế UX/UI",
      socials: [
        {
          icon: <FiGithub />,
          link: "https://github.com/toantc1024",
          label: "toantc1024",
        },
      ],
    },
  ];

  return (
    <div className="pb-24 px-8 gap-4 overflow-auto min-h-screen">
      <Title order={2} ta="center" mt="xl" size={"lg"}>
        Dự án số hóa nghĩa trang liệt sĩ
      </Title>
      <InfoCard
        avatar_image_url={
          "https://avatars.githubusercontent.com/u/179141045?s=200&v=4"
        }
        card_title={"VNHero"}
        card_role={"GNU General Public License v3.0"}
        card_name={"Dự án số hóa nghĩa trang liệt sĩ"}
        socials={[
          {
            icon: <FiGithub />,
            link: "https://github.com/VNCemetery",
            label: "VNCemetery",
          },
        ]}
      />
      <Title order={2} ta="center" mt="xl" size={"lg"}>
        Đơn vị bảo trợ
      </Title>
      <div className="flex items-center justify-center">
        <img src={LOGO} />
      </div>
      <Blockquote color="red" cite="- Hồ Chí Minh" icon={<>🇻🇳</>} mt="xl">
        "Các vua Hùng đã có công dựng nước, Bác cháu ta phải cùng nhau giữ lấy
        nước"
      </Blockquote>
      <div className="flex gap-2 flex-col py-4">
        <Title order={2} ta="center" color="gray" mt="xl" size={"lg"}>
          Đội ngũ phát triển
        </Title>

        {teamMembers.map((member, index) => (
          <div key={index} className="border-[1px] rounded-xl border-gray-200">
            <InfoCard
              avatar_image_url={member.avatar_image_url}
              card_title={member.card_title}
              card_name={member.card_name}
              card_role={member.card_role}
              socials={member.socials}
            />
          </div>
        ))}
      </div>{" "}
    </div>
  );
}
