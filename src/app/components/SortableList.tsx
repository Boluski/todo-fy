import List from "./List";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

export default function SortableList(props: any) {
  // console.log("TestH: ", props.testH);
  const [disableListDrag, setDisableListDrag] = useState(false);

  const {
    attributes,
    listeners,
    isDragging,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id, disabled: disableListDrag });
  const style = {
    opacity: isDragging ? 0.6 : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <List
        projectID={props.projectID}
        setDisableListDrag={setDisableListDrag}
        setChangeNumber={props.setChangeNumber}
        changeLog={props.changeLog}
        setChangeLog={props.setChangeLog}
        listIndex={props.listIndex}
        listTitle={props.listTitle}
        card={props.card}
        items={props.items}
        lists={props.lists}
        setLists={props.setLists}
      />
    </div>
  );
}
