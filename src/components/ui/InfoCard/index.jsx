import { Anchor, Avatar, Group, Text } from "@mantine/core";
import classes from "./InfoCard.module.css";
import { FaPhabricator } from "react-icons/fa";
import { BsGithub } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { FaPerson } from "react-icons/fa6";
import { BiCog } from "react-icons/bi";

export default function InfoCard({
  avatar_image_url,
  card_name,
  card_role,
  card_title,
  socials = [],
  is_reverse = false,
}) {
  return (
    <div>
      <Group
        className={`flex ${is_reverse ? "flex-row-reverse" : ""} px-2 py-2`}
        wrap="nowrap"
      >
        <Avatar src={avatar_image_url} size={94} radius="md" />
        <div>
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            {card_title}
          </Text>

          <Text fz="lg" fw={500} className={classes.name}>
            {card_name}
          </Text>

          <Group wrap="nowrap" gap={10} mt={3}>
            <BiCog stroke={1.5} size={16} className={classes.icon} />
            <Text fz="xs" c="dimmed">
              {card_role}
            </Text>
          </Group>

          <Group wrap="nowrap" gap={10} mt={5}>
            {socials.map((social, index) => {
              return (
                <Anchor
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.social}
                >
                  <div className="flex items-center gap-1">
                    {social.icon}
                    {social.label}
                  </div>
                </Anchor>
              );
            })}
          </Group>
        </div>
      </Group>
    </div>
  );
}
