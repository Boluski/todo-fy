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
import { useState } from "react";

export default function AddListBtn(props: any) {
  const [opened, { toggle }] = useDisclosure(false);
  const [listTitle, setListTitle] = useState("");

  const lists: listType[] = props.lists;

  type cardType = {
    cardID: string;
    cardTitle: string;
    cardDescription: string;
    alpha: number;
  };

  type listType = {
    listID: string;
    listTitle: string;
    isEmpty: boolean;
    cards: cardType[];
  };

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
    let newLists: listType[] = [
      ...lists,
      {
        listID: `L${Date.now()}`,
        listTitle: listTitle,
        cards: [
          {
            cardTitle: "",
            cardDescription: "",
            cardID: `C${Date.now()}`,
            alpha: 0,
          },
        ],
        isEmpty: true,
      },
    ];

    console.log(newLists);
    props.setLists(newLists);
    // setListTitle("");
  }
}
