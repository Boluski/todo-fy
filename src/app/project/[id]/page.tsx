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
              onDragEnd={handleDragEndCard}
              onDragStart={handleDragStartCard}
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
              <SortableList
                key={1}
                id={listArray[0]}
                listTitle={listTitleArray[1 - 1]}
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
                id={listArray[2]}
                listTitle={listTitleArray[2 - 1]}
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
              />
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
