import { forwardRef, useState } from "react";

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
  const [items, setItems] = useState([1, 2, 3]);
  const [activeId, setActiveId] = useState(null);
  type CardType = {
    title: String;
    description: String;
  };
  const cards: CardType[] = props.card;

  function handleDragStart(event: any) {
    const { active } = event;
    console.log(event);

    setActiveId(active.id);
  }

  function handleDragEnd(event: any) {
    console.log(event);
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  }
  // console.log(cards[0]);

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
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
              >
                <SortableContext
                  items={items}
                  strategy={verticalListSortingStrategy}
                >
                  {cards &&
                    items.map((id) => {
                      console.log(cards[id]);

                      return (
                        <SortableCard
                          key={id}
                          id={id}
                          title={cards[id - 1]?.title}
                          description={cards[id - 1]?.description}
                        />
                      );
                    })}
                </SortableContext>
                <DragOverlay
                  style={{
                    opacity: 0.5,
                    cursor: "grab",
                  }}
                >
                  {activeId ? (
                    <Card
                      id={activeId}
                      title={cards[activeId - 1]?.title}
                      description={cards[activeId - 1]?.description}
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
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
