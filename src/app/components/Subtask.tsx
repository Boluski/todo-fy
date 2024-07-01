import { Group, Checkbox, Text, CloseButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { subtaskType } from "../utils/todofyTypes";

export default function Subtask(props: any) {
  const [isChecked, { toggle }] = useDisclosure(props.isChecked);
  return (
    <Group
      style={{
        borderTop: "2px solid gray",
      }}
      justify="space-between"
      bg={"gray.1"}
      h={"3.5rem"}
      px={20}
    >
      <Group>
        <Checkbox
          onChange={handleChange}
          checked={isChecked}
          color="green.8"
          size="md"
        />
        <Text
          style={{ textDecoration: isChecked ? "line-through" : "none" }}
          size="1.3rem"
        >
          {props.subTitle}
        </Text>
      </Group>
      <CloseButton size={"md"} />
    </Group>
  );

  function handleChange() {
    toggle();
    const newCardSubtasks: subtaskType[] = [...props.cardSubtasks];
    newCardSubtasks[props.subtaskIndex] = {
      subtaskID: props.subtaskID,
      title: props.subTitle,
      checked: !isChecked,
    };

    const completedTasks = newCardSubtasks.filter(
      (task) => task.checked == true
    ).length;

    const allTasks = newCardSubtasks.length;

    props.setPercent((completedTasks / allTasks) * 100);

    props.setCardSubtasks(newCardSubtasks);
  }
}
