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

import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";

Amplify.configure(config);
export default function Project({ params }: { params: { id: string } }) {
  const xray = {
    root: {
      outline: "2px solid blue",
    },
  };
  const router = useRouter();

  const projectID = params.id;

  const [activeId, setActiveId] = useState(null);
  const [items, setItems] = useState([1, 2, 3, 4, 5, 6, 7]);
  const listTitleArray = [
    "In Queue",
    "Started",
    "In Progress",
    "Done",
    "Start again",
    "Marketing",
    "Fix",
  ];
  const testHArray = ["", "40rem", "45rem", "", "50rem", "70rem", "60rem"];

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
            <DndContext
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
              collisionDetection={closestCenter}
            >
              <SortableContext
                items={items}
                strategy={horizontalListSortingStrategy}
              >
                {items.map((id) => (
                  <SortableItem
                    key={id}
                    id={id}
                    listTitle={listTitleArray[id - 1]}
                    testH={testHArray[id - 1]}
                  />
                ))}
              </SortableContext>
              <DragOverlay style={{ opacity: 0.7 }}>
                {activeId ? (
                  <List
                    id={activeId}
                    listTitle={listTitleArray[activeId - 1]}
                    testH={testHArray[activeId - 1]}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>

            <AddListBtn />
          </Group>
        </ScrollArea>
      </Stack>
    </>
  );
}
