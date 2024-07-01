import { Group, Checkbox, Text, CloseButton } from "@mantine/core";

export default function Subtask(props: any) {
  return (
    <Group
      style={{
        borderTop: "2px solid black",
      }}
      justify="space-between"
      bg={"gray.1"}
      h={"3.5rem"}
      px={20}
    >
      <Group>
        <Checkbox checked={props.isChecked} color="green.8" size="md" />
        <Text
          style={{ textDecoration: props.isChecked ? "line-through" : "none" }}
          size="1.3rem"
        >
          {props.subTitle}
        </Text>
      </Group>
      <CloseButton size={"md"} />
    </Group>
  );
}
