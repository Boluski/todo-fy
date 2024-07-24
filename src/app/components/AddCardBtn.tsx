import { Paper, Center, TextInput, FocusTrap } from "@mantine/core";
import { useState } from "react";
import { listType, changeLogType } from "../utils/todofyTypes";

import generateID from "../utils/generateID";

export default function AddCardBtn(props: any) {
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
    // Duplicates the List and the ChangeLog and creates a new uid for the list.
    let newLists: listType[] = [...props.lists];
    const uid = generateID().toString();
    let newChangeLog: changeLogType = { ...props.changeLog };
    console.log("card:", newLists[props.listIndex].cards);

    // If List is empty, removes the placeholder card from the list.
    if (newLists[props.listIndex].isEmpty) {
      newLists[props.listIndex].cards.pop();
      newLists[props.listIndex].isEmpty = false;
    }

    // Creates the new card and appends it to the remaining cards in the list.
    // Then adds the id to the ChangeLog.
    newLists[props.listIndex].cards = [
      ...newLists[props.listIndex].cards,
      {
        cardID: `C${uid}`,
        cardTitle: cardTitle,
        cardDescription: ``,
        cardLabel: "#ffffff",
        cardSubtasks: [],
        alpha: 1,
      },
    ];
    newChangeLog.cards.created.push(uid);

    // Save the board schema and the ChangeLog to localStorage.
    localStorage.setItem(props.projectID, JSON.stringify(newLists));
    localStorage.setItem(
      `CHL-${props.projectID}`,
      JSON.stringify(newChangeLog)
    );

    // Update all the necessary states.
    props.setChangeLog(newChangeLog);
    props.setChangeNumber((count: number) => count + 1);
    props.setLists(newLists);
    props.setToggle();
  }
}
