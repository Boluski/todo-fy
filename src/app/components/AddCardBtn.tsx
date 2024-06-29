import { Paper, Center, TextInput, FocusTrap } from "@mantine/core";
import { useState } from "react";
import { listType, cardType, changeLogType } from "../utils/todofyTypes";

import generateID from "../utils/generateID";

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
    const uid = generateID().toString();
    let newChangeLog: changeLogType = { ...props.changeLog };
    console.log("card:", newLists[props.listIndex].cards);

    if (newLists[props.listIndex].isEmpty) {
      newLists[props.listIndex].cards.pop();
      newLists[props.listIndex].isEmpty = false;
    }

    newLists[props.listIndex].cards = [
      ...newLists[props.listIndex].cards,
      {
        cardID: `C${uid}`,
        cardTitle: cardTitle,
        cardDescription: ``,
        alpha: 1,
      },
    ];
    newChangeLog.cards.created.push(uid);

    localStorage.setItem(props.projectID, JSON.stringify(newLists));
    localStorage.setItem(
      `CHL-${props.projectID}`,
      JSON.stringify(newChangeLog)
    );

    props.setChangeLog(newChangeLog);
    props.setChangeNumber((count: number) => count + 1);
    props.setLists(newLists);
    props.setToggle();
  }
}
