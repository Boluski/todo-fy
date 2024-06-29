"use client";

import config from "../../../aws-exports";
import { Amplify } from "aws-amplify";
import { get, put } from "aws-amplify/api";
import { getCurrentUser } from "aws-amplify/auth";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { Group, Stack, ScrollArea, LoadingOverlay } from "@mantine/core";

import { listType, cardType, changeLogType } from "../../utils/todofyTypes";

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
import { useDisclosure } from "@mantine/hooks";

Amplify.configure(config);

export default function Project({ params }: { params: { id: string } }) {
  const router = useRouter();

  const projectID = params.id;

  const [loading, { toggle }] = useDisclosure(true);

  const [projectName, setProjectName] = useState("");
  const [mainTheme, setMainTheme] = useState("");
  const [secondaryTheme, setSecondaryTheme] = useState("");

  const [activeId, setActiveId] = useState(null);
  const [activeId_Card, setActiveId_Card] = useState(null);
  const [activeListID, setActiveListID] = useState(0);
  const [activeCardID, setActiveCardID] = useState(0);

  const [lists, setLists] = useState<listType[]>([]);
  const [changeNumber, setChangeNumber] = useState(0);
  const [changeLog, setChangeLog] = useState<changeLogType>({
    lists: { created: [], deleted: [] },
    cards: { created: [], deleted: [] },
  });

  let board: listType[];

  type sqlData = {
    isError: true;
    errorMes: string;
    result: [
      {
        owner: string;
        title: string;
        main: string;
        secondary: string;
      }
    ];
    fields: object;
  };

  type sqlLists = {
    isError: true;
    errorMes: string;
    result: listType[];
    fields: object;
  };

  const isAuthorized = async () => {
    try {
      await getCurrentUser();
    } catch (e) {
      router.push("/");
    }

    try {
      // console.log(projectID);
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
      console.log(response.result);

      if (owner == username) {
        // console.log(owner);
        // console.log(username);

        setProjectName(response.result[0].title);
        setMainTheme(response.result[0].main);
        setSecondaryTheme(response.result[0].secondary);

        if (localStorage.getItem(projectID) == null) {
          const boardRequest = get({
            apiName: "todofy",
            path: "/TODO-fy/getProjectResource",
            options: { queryParams: { PID: projectID } },
          });
          const { body } = await boardRequest.response;
          const boardResponse = (await body.json()) as sqlLists;
          if (boardResponse.isError) {
            throw new Error(response.errorMes);
          }
          board = boardResponse.result;
          localStorage.setItem(projectID, JSON.stringify(board));
          localStorage.setItem(`CHL-${projectID}`, JSON.stringify(changeLog));
        } else {
          board = JSON.parse(
            localStorage.getItem(projectID) as string
          ) as listType[];

          const latestChangeLog: changeLogType = JSON.parse(
            localStorage.getItem(`CHL-${projectID}`) as string
          );

          console.log("From storage:", latestChangeLog);

          setChangeLog(latestChangeLog);
        }

        // setChangeLog(
        //   JSON.parse(localStorage.getItem(`CHL-${projectID}`) as string)
        // );
        setLists(board);
        toggle();

        console.log("user is authorized");
      } else {
        throw new TypeError("User is not authorized");
      }
    } catch (error) {
      router.push("/dashboard");
      // console.log(error.message);
    }
  };

  useEffect(() => {
    isAuthorized();
  }, []);

  useEffect(() => {
    handleListChange();
  }, [changeNumber]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 1000, distance: 50 },
    })
  );

  return (
    <>
      <Stack h={"100vh"} bg={secondaryTheme} p={10}>
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ blur: 6 }}
          loaderProps={{ color: "green.8" }}
        />
        <ProjectNav projectName={projectName} mainTheme={mainTheme} />
        <ScrollArea type="never">
          <Group h={"100%"} align={"flex-start"} wrap="nowrap">
            {lists?.length != 0 ? (
              <DndContext
                id="draggable-tod0-fy"
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
                      projectID={projectID}
                      setChangeNumber={setChangeNumber}
                      changeLog={changeLog}
                      setChangeLog={setChangeLog}
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
                        title={
                          lists[activeListID].cards[activeCardID].cardTitle
                        }
                        description={
                          lists[activeListID].cards[activeCardID]
                            .cardDescription
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
            ) : null}

            <AddListBtn
              projectID={projectID}
              changeLog={changeLog}
              setChangeLog={setChangeLog}
              setChangeNumber={setChangeNumber}
              lists={lists}
              setLists={setLists}
            />
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
      // console.log(">", newLists);
      // console.log("->", newLists);

      localStorage.setItem(projectID, JSON.stringify(newLists));
      setChangeNumber((count: number) => count + 1);
      setLists(newLists);
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
            localStorage.setItem(projectID, JSON.stringify(newLists));
            setChangeNumber((count: number) => count + 1);
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
              localStorage.setItem(projectID, JSON.stringify(newLists));
              setChangeNumber((count: number) => count + 1);
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
                localStorage.setItem(projectID, JSON.stringify(newLists));
                setChangeNumber((count: number) => count + 1);
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
                  localStorage.setItem(projectID, JSON.stringify(newLists));
                  setChangeNumber((count: number) => count + 1);
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

  async function handleListChange() {
    if (changeNumber == 10) {
      console.log("Save changes now:", changeNumber);
      console.log("Save:", lists);
      setChangeNumber(0);
      // const updateRequest = put({
      //   apiName: "todofy",
      //   path: "/TODO-fy/updateProject",
      //   options: {
      //     body: { projectID: projectID, board: lists },
      //   },
      // });

      // const { body } = await updateRequest.response;

      // const test = await body.json();

      // console.log("UPDATE", test);
    } else {
      console.log("Don't save changes yet:", changeNumber);
    }
    console.log("Change Log:", changeLog);
  }
}
