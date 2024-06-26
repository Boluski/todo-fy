"use client";
import config from "../../../aws-exports";
import { Amplify } from "aws-amplify";
import { get } from "aws-amplify/api";
import { getCurrentUser } from "aws-amplify/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Group, Stack, ScrollArea } from "@mantine/core";

import ProjectNav from "../../components/ProjectNav";
import List from "../../components/List";
import AddListBtn from "../../components/AddListBtn";
import handleArray from "../../utils/handleArray";

import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableList from "../../components/SortableList";
import { randomUUID } from "crypto";

Amplify.configure(config);
export default function Project({ params }: { params: { id: string } }) {
  const router = useRouter();

  const projectID = params.id;

  const [activeId, setActiveId] = useState(null);
  const [activeIdCard, setActiveIdCard] = useState(null);

  const [items, setItems] = useState([1, 2, 3]);
  const [itemsCard, setItemsCard] = useState([
    ["A1", "A2", "A3"],
    ["B1", "B2"],
  ]);

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

  let schema: listType[] = [
    {
      listID: "1",
      listTitle: "In Queue",
      isEmpty: false,
      cards: [
        {
          cardID: "A1",
          cardTitle: "landing page ui",
          cardDescription: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit voluptate eveniet commodi maxime porro eius aut officia libero
                    molestias aliquam quasi delectus, deserunt obcaecati veniam qui
                    dicta repellat nisi debitis.`,
          alpha: 1,
        },
        {
          cardID: "A2",
          cardTitle: "landing page backend",
          cardDescription: ``,
          alpha: 1,
        },
        {
          cardID: "A3",
          cardTitle: "testing",
          cardDescription: ``,
          alpha: 1,
        },
      ],
    },
    {
      listID: "2",
      listTitle: "Started",
      isEmpty: false,
      cards: [
        {
          cardID: "B1",
          cardTitle: "Cool Done",
          cardDescription: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit voluptate eveniet commodi maxime porro eius aut officia libero
                    molestias aliquam quasi delectus, deserunt obcaecati veniam qui
                    dicta repellat nisi debitis.`,
          alpha: 1,
        },
        {
          cardID: "B2",
          cardTitle: "Coollade guy",
          cardDescription: ``,
          alpha: 1,
        },
      ],
    },
  ];

  const [lists, setLists] = useState(schema);

  console.log(itemsCard);

  const listArray = [1, 2];
  const listTitleArray = ["In Queue", "Started", "In progress"];

  type sqlData = {
    isError: true;
    errorMes: string;
    result: [{ owner: string }];
    fields: object;
  };

  const isAuthorized = async () => {
    try {
      await getCurrentUser();
    } catch (e) {
      router.push("/");
    }

    try {
      console.log(projectID);
      const { username } = await getCurrentUser();

      const request = get({
        apiName: "todofy",
        path: "/TODO-fy/getProject",
        options: {
          queryParams: { PID: projectID },
        },
      });

      const { body } = await request.response;
      const response = (await body.json()) as sqlData;

      if (response.isError) {
        throw new TypeError(response.errorMes);
      }

      const owner = response.result[0].owner;

      if (owner == username) {
        console.log(owner);
        console.log(username);

        console.log("user is authorized");
      } else {
        throw new TypeError("User is not authorized");
      }
    } catch (error) {
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    isAuthorized();
  }, []);

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

  function handleDragStartCard(event: any) {
    console.log(itemsCard);

    const { active } = event;
    console.log(event);

    setActiveIdCard(active.id);
  }

  function handleDragEndCard(event: any) {
    console.log(event);
    const { active, over } = event;

    for (let index = 0; index < itemsCard.length; index++) {
      const element = itemsCard[index];

      if (element.length == 0) {
        element.push("id" + Math.random().toString(16).slice(2));
      }
    }

    // for (let index = 0; index < itemsCard.length; index++) {
    //   const element = itemsCard[index];
    //   if (ell) {

    //   }

    // }

    let oldList: number = 0;
    let newList: number = 0;

    for (let index = 0; index < itemsCard.length; index++) {
      const element = itemsCard[index];
      console.log(element);

      for (let v = 0; v < element.length; v++) {
        const elementCard = element[v];
        if (elementCard == active.id) {
          oldList = index;
        }
      }
    }

    for (let index = 0; index < itemsCard.length; index++) {
      const element = itemsCard[index];
      console.log(element);

      for (let v = 0; v < element.length; v++) {
        const elementCard = element[v];
        if (elementCard == over.id) {
          newList = index;
        }
      }
    }

    console.log(oldList);
    console.log(newList);

    if (active.id !== over.id) {
      setItemsCard((itemsCard) => {
        const oldIndex = itemsCard[oldList].indexOf(active.id);
        console.log("Old:", oldIndex);

        const newIndex = itemsCard[newList].indexOf(over.id);

        // console.log(
        //   "arrayMove: ",
        //   arrayMove(itemsCard[search], oldIndex, newIndex)
        // );

        console.log("oldList", itemsCard);

        const test = handleArray(
          itemsCard,
          oldList,
          newList,
          oldIndex,
          newIndex
        );

        return test;
      });
    }
    setActiveIdCard(null);
  }

  function handleOnDragOver(event: any) {
    console.log("Drag over:", event);
  }

  function handleOnDragEnd(event: any) {
    console.log("Event:", event);
    const { active, over } = event;

    const activeListIndex = lists.findIndex((list) =>
      list.cards.some((card) => card.cardID == active.id)
    );
    const activeCardIndex = lists[activeListIndex].cards.findIndex(
      (card) => card.cardID == active.id
    );

    const overListIndex = lists.findIndex((list) =>
      list.cards.some((card) => card.cardID == over.id)
    );
    const overCardIndex = lists[overListIndex].cards.findIndex(
      (card) => card.cardID == over.id
    );

    console.log("Active", lists[activeListIndex].cards[activeCardIndex]);
    console.log("Over", lists[overListIndex].cards[overCardIndex]);

    if (active.id != over.id) {
      let newLists: listType[] = [...lists];
      let remove = false;
      if (lists[overListIndex].isEmpty) {
        remove = true;
      }
      if (lists[activeListIndex] == lists[overListIndex]) {
        const sortedCards = arrayMove(
          lists[activeListIndex].cards,
          activeCardIndex,
          overCardIndex
        );

        newLists[activeListIndex].cards = sortedCards;
        setLists(newLists);
        console.log(lists);
      } else {
        if (overCardIndex == 0) {
          let newCards: cardType[] = [];
          if (remove) {
            newCards = [newLists[activeListIndex].cards[activeCardIndex]];
            newLists[overListIndex].isEmpty = false;
          } else {
            newCards = [
              newLists[activeListIndex].cards[activeCardIndex],
              ...newLists[overListIndex].cards,
            ];
          }

          newLists[activeListIndex].cards.splice(activeCardIndex, 1);
          if (newLists[activeListIndex].cards.length == 0) {
            newLists[activeListIndex].isEmpty = true;
            newLists[activeListIndex].cards.push({
              cardTitle: "",
              cardDescription: "",
              cardID: Date.now().toString(),
              alpha: 0,
            });
          }

          newLists[overListIndex].cards = newCards;
          setLists(newLists);
        }

        if (!remove) {
          if (overCardIndex == lists[overListIndex].cards.length - 1) {
            let newCards: cardType[] = [];

            newCards = [
              ...newLists[overListIndex].cards,
              newLists[activeListIndex].cards[activeCardIndex],
            ];

            newLists[activeListIndex].cards.splice(activeCardIndex, 1);
            if (newLists[activeListIndex].cards.length == 0) {
              newLists[activeListIndex].isEmpty = true;
              newLists[activeListIndex].cards.push({
                cardTitle: "",
                cardDescription: "",
                cardID: Date.now().toString(),
                alpha: 0,
              });
            }

            newLists[overListIndex].cards = newCards;
            setLists(newLists);
          }
        }
      }

      // console.log(lists[0].cards[activeCard]);
    } else {
    }
  }

  return (
    <>
      <Stack h={"100vh"} bg={"green.0"} p={10}>
        <ProjectNav />
        <ScrollArea type="never">
          <Group
            // styles={xray}
            h={"100%"}
            align={"flex-start"}
            wrap="nowrap"
          >
            {/* <DndContext
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
              collisionDetection={closestCenter}
            >
              <SortableContext
                items={items}
                strategy={horizontalListSortingStrategy}
              > */}

            <DndContext
              collisionDetection={closestCenter}
              // onDragOver={handleOnDragOver}
              onDragEnd={handleOnDragEnd}
              // onDragStart={}
            >
              {/* {items.map((id) => (
                <SortableList
                  key={id}
                  id={id}
                  listTitle={listTitleArray[id - 1]}
                  card={[
                    {
                      title: "landing page ui",
                      description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit voluptate eveniet commodi maxime porro eius aut officia libero
                    molestias aliquam quasi delectus, deserunt obcaecati veniam qui
                    dicta repellat nisi debitis.`,
                    },
                    {
                      title: "landing page backend",
                      description: ``,
                    },
                    {
                      title: "testing",
                      description: ``,
                    },
                  ]}
                />
              ))} */}

              {lists.map((list) => (
                <SortableList
                  key={list.listID}
                  id={list.listID}
                  listTitle={list.listTitle}
                  items={list.cards.map((card) => card.cardID)}
                  card={list.cards.map((card) => ({
                    cardTitle: card.cardTitle,
                    cardDescription: card.cardDescription,
                    cardID: card.cardID,
                    alpha: card.alpha,
                  }))}
                />
              ))}
              {/* 
              <SortableList
                key={listArray}
                id={listArray[0]}
                listTitle={listTitleArray[0]}
                items={itemsCard[0]}
                card={[
                  {
                    title: "landing page ui",
                    description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit voluptate eveniet commodi maxime porro eius aut officia libero
                    molestias aliquam quasi delectus, deserunt obcaecati veniam qui
                    dicta repellat nisi debitis.`,
                    id: "A1",
                  },
                  {
                    title: "landing page backend",
                    description: ``,
                    id: "A2",
                  },
                  {
                    title: "testing",
                    description: ``,
                    id: "A3",
                  },
                ]}
              />

              <SortableList
                key={2}
                id={listArray[1]}
                listTitle={listTitleArray[1]}
                items={itemsCard[1]}
                card={[
                  {
                    title: "landing page ui 1",
                    description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit voluptate eveniet commodi maxime porro eius aut officia libero
                    molestias aliquam quasi delectus, deserunt obcaecati veniam qui
                    dicta repellat nisi debitis.`,
                    id: "B1",
                  },
                  {
                    title: "landing page backend 1",
                    description: ``,
                    id: "B2",
                  },
                ]}
              /> */}
            </DndContext>

            {/* </SortableContext>
              <DragOverlay
                style={{
                  opacity: 0.7,
                  cursor: "grab",
                }}
              >
                {activeId ? (
                  <List
                    id={activeId}
                    listTitle={listTitleArray[activeId - 1]}
                  />
                ) : null}
              </DragOverlay>
            </DndContext> */}

            <AddListBtn />
          </Group>
        </ScrollArea>
      </Stack>
    </>
  );
}
