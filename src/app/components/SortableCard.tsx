import Card from "./Card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

export default function SortableCard(props: any) {
  const [disableCardDrag, setDisableCardDrag] = useState(false);
  const {
    attributes,
    listeners,
    isDragging,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id, disabled: disableCardDrag });
  const style = {
    opacity: isDragging ? 0.6 : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        cardID={props.id}
        setChangeNumber={props.setChangeNumber}
        changeLog={props.changeLog}
        setChangeLog={props.setChangeLog}
        projectID={props.projectID}
        lists={props.lists}
        setLists={props.setLists}
        listIndex={props.listIndex}
        cardIndex={props.cardIndex}
        //
        setDisableCardDrag={setDisableCardDrag}
        setDisableListDrag={props.setDisableListDrag}
        //
        title={props.title}
        description={props.description}
        label={props.label}
        alpha={props.alpha}
      />
    </div>
  );
}
