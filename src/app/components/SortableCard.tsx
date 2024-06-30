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
        setDisableCardDrag={setDisableCardDrag}
        setDisableListDrag={props.setDisableListDrag}
        title={props.title}
        description={props.description}
        alpha={props.alpha}
      />
    </div>
  );
}
