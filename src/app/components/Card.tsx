import { Box, Stack, Title, Text, Group, Paper } from "@mantine/core";
import { TbSubtask } from "react-icons/tb";
import { xray } from "../utils/xray";

export default function Card(props: any) {
  return (
    <Paper shadow="sm">
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
            Work on the home page
          </Title>
          <Text pt={5} lineClamp={3}>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit
            voluptate eveniet commodi maxime porro eius aut officia libero
            molestias aliquam quasi delectus, deserunt obcaecati veniam qui
            dicta repellat nisi debitis.
          </Text>
          <Group pt={10} justify="end">
            <TbSubtask size={"1.2rem"} />
          </Group>
        </Stack>
      </Stack>
    </Paper>
  );
}
