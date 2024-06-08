import { forwardRef } from "react";

import { Stack, Group, Title, ActionIcon, Paper, Button } from "@mantine/core";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { IoMdAdd } from "react-icons/io";
import Card from "./Card";

// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";

function List(props: any, ref: any) {
  type CardType = {
    title: String;
    description: String;
  };
  const cards = props.card;
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
              {/* {cards.map((id: any, index: Number) => {
                <Card key={index} />;
              })} */}

              {cards &&
                cards.map((card: any, id: any) => {
                  return (
                    <Card
                      key={id}
                      title={card.title}
                      description={card.description}
                    />
                  );
                })}
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
