import { Stack, Group, Title, ActionIcon, Paper, Button } from "@mantine/core";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { IoMdAdd } from "react-icons/io";

export default function List(props: any) {
  const xray = {
    root: {
      outline: "2px solid blue",
    },
  };
  return (
    <>
      <Paper shadow={"md"}>
        <Stack
          bg={"white"}
          w={"20rem"}
          p={10}
          styles={{ root: { borderRadius: "5px" } }}
        >
          <Group justify={"space-between"}>
            <Title order={3}>{props.listTitle}</Title>
            <ActionIcon size={"lg"} variant="subtle" color="black">
              <PiDotsThreeOutlineVerticalFill size={"1.5em"} />
            </ActionIcon>
          </Group>

          <Stack w={"100%"} mih={"20rem"} h={props.testH} bg={"gray.2"}></Stack>

          <Button
            leftSection={<IoMdAdd size={"1.5em"} />}
            color="black"
            variant="transparent"
          >
            Add Card
          </Button>
        </Stack>
      </Paper>
    </>
  );
}
