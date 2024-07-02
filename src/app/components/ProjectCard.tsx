import { Stack, Title, Button, Group, Paper } from "@mantine/core";
import { xray } from "../utils/xray";

export default function ProjectCard(props: any) {
  return (
    <Paper
      //   w={"30rem"}
      h={"12rem"}
      styles={{ root: { borderRadius: "1rem" } }}
      shadow="lg"
    >
      <Stack
        // styles={xray}
        bg={"green.8"}
        style={{ borderRadius: "1rem" }}
        p={20}
        h={"100%"}
        justify={"space-between"}
      >
        <Title c={"white"}>Project Management</Title>
        <Group justify="end">
          <Button variant="light" color="white" size="lg">
            Open Project
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
