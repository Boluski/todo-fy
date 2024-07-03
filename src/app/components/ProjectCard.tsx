import { Stack, Title, Button, Group, Paper } from "@mantine/core";
import { xray } from "../utils/xray";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";

export default function ProjectCard(props: any) {
  const projectURL = `/project/${props.id}`;
  const [loading, { toggle }] = useDisclosure(false);
  const router = useRouter();

  return (
    <Paper
      //   w={"30rem"}
      h={"12rem"}
      styles={{ root: { borderRadius: "0.5rem" } }}
      shadow="lg"
    >
      <Stack
        // styles={xray}
        bg={props.color}
        style={{ borderRadius: "0.5rem" }}
        p={20}
        h={"100%"}
        justify={"space-between"}
      >
        <Title c={"white"}>{props.title}</Title>
        <Group justify="end">
          <Button
            radius={"md"}
            variant="light"
            color="white"
            size="lg"
            loading={loading}
            onClick={() => {
              toggle();
              router.push(projectURL);
            }}
          >
            Open Project
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
