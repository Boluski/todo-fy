"use client";
import config from "../../../aws-exports";
import { Amplify } from "aws-amplify";
import { get } from "aws-amplify/api";
import { getCurrentUser } from "aws-amplify/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SortableItem from "./SortableItem";

import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";

Amplify.configure(config);
export default function Project({ params }: { params: { id: string } }) {
  const router = useRouter();

  const projectID = params.id;
  // const [items, setItems] = useState([1, 2, 3]);
  // const sensors = useSensors(
  //   useSensor(PointerSensor),
  //   useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  // );

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

  // const names = ["Bolu", "Bosun", "Omolade"];
  useEffect(() => {
    isAuthorized();
  }, []);

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
  // }

  return (
    <>
      <h1>Project ID: {projectID}</h1>
      {/* <DndContext
        // sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((id) => (
            <SortableItem key={id} id={id} name={names[id - 1]} />
          ))}
        </SortableContext>
      </DndContext> */}
    </>
  );
}
