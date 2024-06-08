import {
  Paper,
  Stack,
  Button,
  TextInput,
  Collapse,
  FocusTrap,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IoMdAdd } from "react-icons/io";
import { xray } from "../utils/xray";

export default function AddListBtn() {
  const [opened, { toggle }] = useDisclosure(false);
  return (
    <Paper shadow="md">
      <Stack
        w={"25rem"}
        bg={"white"}
        p={10}
        styles={{ root: { borderRadius: "5px" } }}
      >
        <Button
          size="md"
          leftSection={<IoMdAdd size={"1.5em"} />}
          color="black"
          variant="transparent"
          onClick={toggle}
        >
          Add List
        </Button>

        <Collapse in={opened}>
          <FocusTrap active={opened}>
            <TextInput
              variant="filled"
              size="md"
              placeholder="Enter List Name"
            />
          </FocusTrap>
        </Collapse>
      </Stack>
    </Paper>
  );
}
