import { forwardRef, useState, useEffect } from "react";

import { Stack, Group, Title, ActionIcon, Paper, Button } from "@mantine/core";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { IoMdAdd } from "react-icons/io";
import SortableCard from "./SortableCard";
import Card from "./Card";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

function List(props: any, ref: any) {
  // const items: [] = props.items;
  // console.log("List:", items);

  // const [items, setItems] = useState(props.items as []);
  const [activeId, setActiveId] = useState(null);

  type cardType = {
    cardID: string;
    cardTitle: string;
    cardDescription: string;
  };

  const cards: cardType[] = props.card;
  console.log("Cards:", cards);

  // function handleDragStart(event: any) {
  //   const { active } = event;
  //   console.log(event);

  //   setActiveId(active.id);
  // }

  // function handleDragEnd(event: any) {
  //   console.log(event);
  //   const { active, over } = event;
  //   if (active.id !== over.id) {
  //     setItems((items) => {
  //       const oldIndex = items.indexOf(active.id);
  //       const newIndex = items.indexOf(over.id);
  //       return arrayMove(items, oldIndex, newIndex);
  //     });
  //   }
  //   setActiveId(null);
  // }
  // console.log(cards[0]);

  // useEffect(() => {
  //   setItems(props.items);
  // }, []);
  return (
    <>
      <div ref={ref}>
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

            <Stack w={"100%"} mih={"20rem"} p={10} bg={"gray.2"}>
              {/* <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
              > */}
              <SortableContext
                items={cards.map((card) => card.cardID)}
                strategy={verticalListSortingStrategy}
              >
                {cards.map((card) => (
                  <SortableCard
                    key={card.cardID}
                    id={card.cardID}
                    title={card.cardTitle}
                    description={card.cardDescription}
                  />
                ))}

                {/* {items &&
                  items.map((id, index) => {
                    let search = 0;

                    for (let index = 0; index < cards.length; index++) {
                      const element = cards[index];
                      if (element.id === id) {
                        search = index;
                      }
                    }

                    return (
                      <SortableCard
                        key={id}
                        id={id}
                        title={cards[search]?.title}
                        description={cards[search]?.description}
                      />
                    );
                    // }
                  })} */}
              </SortableContext>
              {/* <DragOverlay
                style={{
                  opacity: 0.5,
                  cursor: "grab",
                }}
              >
                {activeId ? (
                  <Card
                    id={activeId}
                    title={cards[items.indexOf(activeId)]?.title}
                    description={cards[items.indexOf(activeId)]?.description}
                  />
                ) : null}
              </DragOverlay> */}
              {/* </DndContext> */}
            </Stack>

            <Button
              leftSection={<IoMdAdd size={"1.5em"} />}
              color="black"
              variant="transparent"
            >
              Add Card
            </Button>
          </Stack>
        </Paper>
      </div>
    </>
  );
}

export default forwardRef(List);
