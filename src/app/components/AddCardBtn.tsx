import { Paper, Center, TextInput, FocusTrap } from "@mantine/core";
import { useState } from "react";
import { listType, cardType } from "../utils/todofyTypes";

export default function AddCardBtn(props: any) {
  // const lists: listType[] = [...props.lists]
  // console.log(props.listIndex);

  const [cardTitle, setCardTitle] = useState("");
  return (
    <>
      <Paper shadow="sm" display={props.display ? "block" : "none"}>
        <Center styles={{ root: { borderRadius: "5px" } }}>
          <FocusTrap active={props.display}>
            <TextInput
              size="md"
              variant="filled"
              w={"90%"}
              py={10}
              placeholder="Card Name:"
              onChange={(e) => {
                setCardTitle(e.currentTarget.value);
              }}
              onKeyDownCapture={(e) => {
                if (e.key == "Enter") {
                  handleNewCard();
                  e.currentTarget.value = "";
                }
              }}
            />
          </FocusTrap>
        </Center>
      </Paper>
    </>
  );

  function handleNewCard() {
    let newLists: listType[] = [...props.lists];
    console.log("card:", newLists[props.listIndex].cards);

    if (newLists[props.listIndex].isEmpty) {
      newLists[props.listIndex].cards.pop();
      newLists[props.listIndex].isEmpty = false;
    }

    newLists[props.listIndex].cards = [
      ...newLists[props.listIndex].cards,
      {
        cardID: `C${Date.now()}`,
        cardTitle: cardTitle,
        cardDescription: ``,
        alpha: 1,
      },
    ];

    localStorage.setItem(props.projectID, JSON.stringify(newLists));
    props.setChangeNumber((count: number) => count + 1);
    props.setLists(newLists);
    props.setToggle();
  }
}
