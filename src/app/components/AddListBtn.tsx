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

    // Creates the new List and adds it to the rest of the lists.
    // And updates the ChangeLog.
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

    // Save the changes to the local storage.
    localStorage.setItem(props.projectID, JSON.stringify(newLists));
    localStorage.setItem(
      `CHL-${props.projectID}`,
      JSON.stringify(newChangeLog)
    );

    // Update necessary states.
    props.setChangeLog(newChangeLog);
    props.setLists(newLists);
    props.setChangeNumber((count: number) => count + 1);
  }
}
