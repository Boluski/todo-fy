import { Group, ActionIcon, DEFAULT_THEME, Title } from "@mantine/core";
import { IoHomeOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function ProjectNav(props: any) {
  const router = useRouter();

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
          border: `2px solid ${props.mainTheme}`,
          borderRadius: "5px",
        },
      }}
    >
      <ActionIcon
        size={"xl"}
        variant="light"
        color={props.mainTheme}
        onClick={() => {
          router.push("/dashboard");
        }}
      >
        <IoHomeOutline size={"2em"} />
      </ActionIcon>
      <Title order={1} c={props.mainTheme}>
        {props.projectName}
      </Title>
    </Group>
  );
}
