import React from "react";
import clsx from "clsx";
import { Droppable, Draggable } from "react-beautiful-dnd";
import styles from "./style.module.css";

const CategoryCard = ({
  category,
  isActive,
  onCategoryChange,
  selectedItem,
  onRemoveItem,
}) => {
  let selectedItemJsx = null;

  if (selectedItem && selectedItem.subcategories) {
    const { subcategories } = selectedItem;

    const keys = Object.keys(subcategories);

    selectedItemJsx = keys.map((key, index) => {
      const subcategory = subcategories[key];

      return (
        <Draggable
          draggableId={subcategory.id}
          index={index}
          isDragDisabled
          key={subcategory.id}
        >
          {(provided) => (
            <div
              className={styles.selectedItem}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <span>{subcategory.name}</span>
              <span
                className={styles.removeButton}
                type="button"
                onClick={() =>
                  onRemoveItem(subcategory.categoryId, subcategory.id)
                }
              >
                x
              </span>
            </div>
          )}
        </Draggable>
      );
    });
  }

  return (
    <button
      type="button"
      className={clsx(styles.categoryCard, {
        [styles.active]: isActive,
      })}
      onClick={() => onCategoryChange(category.id)}
    >
      <div className={styles.header}>{category.name}</div>
      <Droppable droppableId={category.id} isDropDisabled={!isActive}>
        {(provided, snapshot) => (
          <div
            className={clsx(styles.content, styles.disableHover, {
              [styles.isDraggingOver]: snapshot.isDraggingOver,
            })}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {selectedItemJsx}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </button>
  );
};

export default CategoryCard;
