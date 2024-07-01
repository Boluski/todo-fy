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
import { listType, changeLogType } from "../utils/todofyTypes";
import { useState } from "react";

import generateID from "../utils/generateID";

export default function AddListBtn(props: any) {
  const [opened, { toggle }] = useDisclosure(false);
  const [listTitle, setListTitle] = useState("");

  const lists: listType[] = props.lists;

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
              onChange={(e) => setListTitle(e.currentTarget.value)}
              onKeyDownCapture={(e) => {
                if (e.key == "Enter") {
                  handleNewList();
                  e.currentTarget.value = "";
                }
              }}
            />
          </FocusTrap>
        </Collapse>
      </Stack>
    </Paper>
  );

  function handleNewList() {
    const uid = generateID().toString();
    let newChangeLog: changeLogType = { ...props.changeLog };

    let newLists: listType[] = [
      ...lists,
      {
        listID: `L${uid}`,
        listTitle: listTitle,
        cards: [
          {
            cardTitle: "",
            cardDescription: "",
            cardID: `C${uid}`,
            cardLabel: "#ffffff",
            cardSubtasks: [],
            alpha: 0,
          },
        ],
        isEmpty: true,
      },
    ];

    newChangeLog.lists.created.push(uid);

    // console.log(newLists);
    localStorage.setItem(props.projectID, JSON.stringify(newLists));
    localStorage.setItem(
      `CHL-${props.projectID}`,
      JSON.stringify(newChangeLog)
    );

    props.setChangeLog(newChangeLog);
    props.setLists(newLists);
    props.setChangeNumber((count: number) => count + 1);
    // setListTitle("");
  }
}
