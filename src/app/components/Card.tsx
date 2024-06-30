import {
  Box,
  Stack,
  Title,
  Text,
  Group,
  Paper,
  Modal,
  TextInput,
  ColorPicker,
  ColorSwatch,
  DEFAULT_THEME,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { TbSubtask } from "react-icons/tb";
import { useState } from "react";
import { xray } from "../utils/xray";

export default function Card(props: any) {
  const [opened, { open, close }] = useDisclosure(false);

  const [title, setTitle] = useState(props.title);
  const [label, setLabel] = useState("#ffffff");

  const themeArray = [
    "#ffffff",
    DEFAULT_THEME.colors.green[8],
    DEFAULT_THEME.colors.blue[8],
    DEFAULT_THEME.colors.red[8],
    DEFAULT_THEME.colors.violet[8],
    DEFAULT_THEME.colors.orange[8],
    DEFAULT_THEME.colors.cyan[8],
    DEFAULT_THEME.colors.teal[8],
    DEFAULT_THEME.colors.lime[8],
  ];

  return (
    <>
      <Paper shadow="sm" opacity={props.alpha}>
        <Stack bg={label} style={{ borderRadius: "0.2rem" }} onClick={open}>
          <Stack
            gap={0}
            style={{
              borderBottomRightRadius: "inherit",
              borderTopRightRadius: "inherit",
            }}
            bg={"white"}
            ml={8}
            p={10}
            //    styles={xray}
          >
            <Title lineClamp={2} order={3}>
              {title}
            </Title>
            <Text pt={5} lineClamp={3}>
              {props.description}
            </Text>
            <Group pt={10} justify="end">
              <TbSubtask size={"1.2rem"} />
            </Group>
          </Stack>
        </Stack>
      </Paper>
      <Modal
        opened={opened}
        onClose={close}
        title={"Card Details"}
        centered
        size={"lg"}
        styles={{ title: { fontSize: "2rem" } }}
      >
        <Stack
        // styles={xray}
        >
          <Group
          // justify={"end"}

          //  styles={xray}
          >
            <Text size="1.5rem">Title:</Text>
            <TextInput
              size="md"
              w={"32rem"}
              variant="filled"
              value={title}
              onChange={(e) => {
                setTitle(e.currentTarget.value);
              }}
            />
          </Group>
          <Group
          // justify="end"
          >
            <Group>
              <Text size="1.5rem">Label:</Text>
              <ColorSwatch w={"5rem"} color={label} />
            </Group>
            <ColorPicker
              w={"26rem"}
              format="hex"
              withPicker={false}
              fullWidth
              value={label}
              onChange={setLabel}
              focusable={true}
              swatchesPerRow={9}
              swatches={themeArray}
            />
          </Group>
          <Group>
            <Text size="1.5rem">Description:</Text>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
