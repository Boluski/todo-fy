"use client";

import config from "../../../aws-exports";
import { Amplify } from "aws-amplify";
import { get } from "aws-amplify/api";
import { getCurrentUser } from "aws-amplify/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Group, Stack, ScrollArea } from "@mantine/core";

import { listType, cardType } from "../../utils/todofyTypes";

import ProjectNav from "../../components/ProjectNav";
import List from "../../components/List";
import AddListBtn from "../../components/AddListBtn";

import {
  DndContext,
  DragOverlay,
  closestCenter,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableList from "../../components/SortableList";
import Card from "../../components/Card";

Amplify.configure(config);
export default function Project({ params }: { params: { id: string } }) {
  const router = useRouter();

  const projectID = params.id;

  const [activeId, setActiveId] = useState(null);
  const [activeId_Card, setActiveId_Card] = useState(null);

  const [activeListID, setActiveListID] = useState(0);
  const [activeCardID, setActiveCardID] = useState(0);

  let schema: listType[] = [
    {
      listID: "L1",
      listTitle: "In Queue",
      isEmpty: false,
      cards: [
        {
          cardID: "C1",
          cardTitle: "landing page ui",
          cardDescription: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit voluptate eveniet commodi maxime porro eius aut officia libero
                    molestias aliquam quasi delectus, deserunt obcaecati veniam qui
                    dicta repellat nisi debitis.`,
          alpha: 1,
        },
        {
          cardID: "C2",
          cardTitle: "landing page backend",
          cardDescription: ``,
          alpha: 1,
        },
        {
          cardID: "C3",
          cardTitle: "testing",
          cardDescription: ``,
          alpha: 1,
        },
      ],
    },
    {
      listID: "L2",
      listTitle: "Started",
      isEmpty: false,
      cards: [
        {
          cardID: "C4",
          cardTitle: "Cool Done",
          cardDescription: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit voluptate eveniet commodi maxime porro eius aut officia libero
                    molestias aliquam quasi delectus, deserunt obcaecati veniam qui
                    dicta repellat nisi debitis.`,
          alpha: 1,
        },
        {
          cardID: "C5",
          cardTitle: "Coollade guy",
          cardDescription: ``,
          alpha: 1,
        },
      ],
    },
  ];

  const [lists, setLists] = useState(schema);

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 1000, distance: 50 },
    })
  );

  return (
    <>
      <Stack h={"100vh"} bg={"green.0"} p={10}>
        <ProjectNav />
        <ScrollArea type="never">
          <Group h={"100%"} align={"flex-start"} wrap="nowrap">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleOnDragEnd}
              onDragStart={handleOnDragStart}
              sensors={sensors}
            >
              <SortableContext
                items={lists.map((list) => list.listID)}
                strategy={horizontalListSortingStrategy}
              >
                {lists.map((list, index) => (
                  <SortableList
                    key={list.listID}
                    id={list.listID}
                    listTitle={list.listTitle}
                    lists={lists}
                    setLists={setLists}
                    listIndex={index}
                    items={list.cards?.map((card) => card.cardID)}
                    card={list.cards?.map((card) => ({
                      cardTitle: card.cardTitle,
                      cardDescription: card.cardDescription,
                      cardID: card.cardID,
                      alpha: card.alpha,
                    }))}
                  />
                ))}

                <DragOverlay>
                  {activeId_Card ? (
                    <Card
                      title={lists[activeListID].cards[activeCardID].cardTitle}
                      description={
                        lists[activeListID].cards[activeCardID].cardDescription
                      }
                      alpha={"1"}
                    />
                  ) : null}

                  {activeId ? (
                    <List
                      listTitle={lists[activeListID].listTitle}
                      card={lists[activeListID].cards.map((card) => ({
                        cardTitle: card.cardTitle,
                        cardDescription: card.cardDescription,
                        cardID: card.cardID,
                        alpha: card.alpha,
                      }))}
                    />
                  ) : null}
                </DragOverlay>
              </SortableContext>
            </DndContext>
            <AddListBtn lists={lists} setLists={setLists} />
          </Group>
        </ScrollArea>
      </Stack>
    </>
  );

  function handleOnDragStart(event: any) {
    const { active } = event;

    let activeListIndex = lists.findIndex((list) =>
      list.cards.some((card) => card.cardID == active.id)
    );
    let activeCardIndex = 0;

    if (activeListIndex != -1) {
      activeCardIndex = lists[activeListIndex].cards.findIndex(
        (card) => card.cardID == active.id
      );
      console.log("Active", lists[activeListIndex].cards[activeCardIndex]);
      setActiveId_Card(active.id);
      setActiveId(null);
      setActiveListID(activeListIndex);
      setActiveCardID(activeCardIndex);
    } else {
      console.log("list level");
      activeListIndex = lists.findIndex((list) => list.listID == active.id);

      setActiveId(active.id);
      setActiveId_Card(null);
      setActiveListID(activeListIndex);
    }
  }

  function handleOnDragEnd(event: any) {
    console.log("Event:", event);
    const { active, over } = event;
    const verifyOver: string = over.id;
    const verifyActive: string = active.id;

    if (verifyActive.charAt(0) == "L" && verifyOver.charAt(0) == "L") {
      console.log("List over List");
      const activeListIndex = lists.findIndex(
        (list) => list.listID == active.id
      );
      const overListIndex = lists.findIndex((list) => list.listID == over.id);

      console.log("Active", lists[activeListIndex]);
      console.log("Over", lists[overListIndex]);

      const newLists = arrayMove(lists, activeListIndex, overListIndex);
      console.log(">", newLists);
      setLists(newLists);
      console.log("->", newLists);

      setActiveId(null);
    } else {
      if (verifyOver.charAt(0) == "L" || verifyActive.charAt(0) == "L") {
        return;
      } else {
        const activeListIndex = lists.findIndex((list) =>
          list.cards.some((card) => card.cardID == active.id)
        );

        const overListIndex = lists.findIndex((list) =>
          list.cards.some((card) => card.cardID == over.id)
        );

        const activeCardIndex = lists[activeListIndex].cards.findIndex(
          (card) => card.cardID == active.id
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
          } else {
            if (
              overCardIndex != 0 &&
              overCardIndex != lists[overListIndex].cards.length - 1
            ) {
              newLists[overListIndex].cards.splice(
                overCardIndex,
                0,
                lists[activeListIndex].cards[activeCardIndex]
              );
              newLists[activeListIndex].cards.splice(activeCardIndex, 1);

              if (newLists[activeListIndex].cards.length == 0) {
                newLists[activeListIndex].isEmpty = true;
                newLists[activeListIndex].cards.push({
                  cardTitle: "",
                  cardDescription: "",
                  cardID: `C${Date.now()}`,
                  alpha: 0,
                });
              }
              setLists(newLists);
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
                    cardID: `C${Date.now()}`,
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
                      cardID: `C${Date.now()}`,
                      alpha: 0,
                    });
                  }
                  newLists[overListIndex].cards = newCards;
                  setLists(newLists);
                }
              }
            }
          }
        }
      }
    }

    setActiveId_Card(null);
  }
}
