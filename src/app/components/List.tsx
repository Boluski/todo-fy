"use client";

import { Stack, Group, Title, ActionIcon, Paper, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { IoMdAdd } from "react-icons/io";
import SortableCard from "./SortableCard";

import { cardType } from "../utils/todofyTypes";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import AddCardBtn from "./AddCardBtn";

export default function List(props: any) {
  const [opened, { toggle }] = useDisclosure(false);
  const cards: cardType[] = props.card;

  return (
    <>
      <div>
        <Paper shadow={"md"} mb={"2rem"}>
          <Stack
            bg={"white"}
            w={"25rem"}
            p={10}
            styles={{ root: { borderRadius: "5px" } }}
          >
            <Group justify={"space-between"}>
              <Title order={3}>{props.listTitle}</Title>
              <ActionIcon size={"lg"} variant="subtle" color="black">
                <PiDotsThreeOutlineVerticalFill size={"1.5em"} />
              </ActionIcon>
            </Group>

            <Stack w={"100%"} mih={"5rem"} p={10} bg={"gray.2"}>
              <SortableContext
                items={cards.map((card) => card.cardID)}
                strategy={verticalListSortingStrategy}
              >
                {cards.map((card) => (
                  <SortableCard
                    key={card.cardID}
                    id={card.cardID}
                    setDisableListDrag={props.setDisableListDrag}
                    title={card.cardTitle}
                    description={card.cardDescription}
                    alpha={card.alpha}
                    label={card.cardLabel}
                    subtasks={card.cardSubtasks}
                    // Utilities
                    cardIndex={card.cardIndex}
                    setChangeNumber={props.setChangeNumber}
                    changeLog={props.changeLog}
                    setChangeLog={props.setChangeLog}
                    projectID={props.projectID}
                    lists={props.lists}
                    setLists={props.setLists}
                    listIndex={props.listIndex}
                  />
                ))}
              </SortableContext>
              <AddCardBtn
                display={opened}
                setToggle={toggle}
                setChangeNumber={props.setChangeNumber}
                changeLog={props.changeLog}
                setChangeLog={props.setChangeLog}
                projectID={props.projectID}
                lists={props.lists}
                setLists={props.setLists}
                listIndex={props.listIndex}
              />
            </Stack>

            <Button
              leftSection={<IoMdAdd size={"1.5em"} />}
              color="black"
              variant="transparent"
              onClick={toggle}
            >
              Add Card
            </Button>
          </Stack>
        </Paper>
      </div>
    </>
  );
}
