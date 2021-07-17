import React from "react";
import clsx from "clsx";
import { Draggable } from "react-beautiful-dnd";
import styles from "./style.module.css";

const SubcategoryItem = ({ subcategory, index }) => {
  return (
    <Draggable draggableId={subcategory.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={clsx(styles.subcategoryItem, {
            [styles.dragging]: snapshot.isDragging,
          })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {subcategory.name}
        </div>
      )}
    </Draggable>
  );
};

export default SubcategoryItem;
