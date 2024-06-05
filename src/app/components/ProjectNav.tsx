import { Group, ActionIcon, DEFAULT_THEME, Title } from "@mantine/core";
import { IoHomeOutline } from "react-icons/io5";

export default function ProjectNav() {
  const xray = {
    root: {
      outline: "2px solid blue",
    },
  };

  return (
    <Group
      bg={"white"}
      p={12}
      styles={{
        root: {
          border: `2px solid ${DEFAULT_THEME.colors.green[8]}`,
          borderRadius: "5px",
        },
      }}
    >
      <ActionIcon size={"xl"} variant="light" color={"green.8"}>
        <IoHomeOutline size={"2em"} />
      </ActionIcon>
      <Title order={1} c={"green.8"}>
        Spellblaze
      </Title>
    </Group>
  );
}
