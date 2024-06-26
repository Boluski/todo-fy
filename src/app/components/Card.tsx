import { Box, Stack, Title, Text, Group, Paper } from "@mantine/core";
import { TbSubtask } from "react-icons/tb";
import { xray } from "../utils/xray";

export default function Card(props: any) {
  return (
    <Paper shadow="sm" opacity={props.alpha}>
      <Stack bg={"green.8"} style={{ borderRadius: "0.2rem" }}>
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
            {props.title}
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
  );
}
