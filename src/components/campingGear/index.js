import React from "react";
import sortBy from "lodash/sortBy";
import Masonry from "react-masonry-css";
import { Droppable } from "react-beautiful-dnd";
import Container from "components/container";
import Button from "components/button";
import CategoryCard from "components/categoryCard";
import styles from "./style.module.css";
import SubcategoryItem from "components/subcategoryItem";

const breakpointColumnsObj = {
  default: 3,
  960: 3,
  700: 2,
  500: 1,
};

const CampingGear = ({
  categories,
  onCategoryChange,
  selectedCategoryId,
  selectedItems,
  onRemoveItem,
  isSubmitDisbaled,
  isSubmiting,
  onSubmit,
  onReset,
}) => {
  const categoryKeys = Object.keys(categories);

  const categoriesArray = categoryKeys.map((key) => ({
    ...categories[key],
  }));

  const sortedCategories = sortBy(categoriesArray, [(o) => o.precedence]);

  const subcategories = categories[selectedCategoryId].subcategories;
  const subcategoriesKeys = Object.keys(subcategories);

  const subcategoriesArray = subcategoriesKeys.map((key) => ({
    ...subcategories[key],
  }));

  const sortedSubcategories = sortBy(subcategoriesArray, [(o) => o.precedence]);

  return (
    <Container>
      <div className={styles.main}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            {categories[selectedCategoryId].name}
          </div>
          <div className={styles.sidebarMain}>
            <Droppable droppableId="sidebar">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {sortedSubcategories.map((subcategory, index) => (
                    <SubcategoryItem
                      subcategory={subcategory}
                      key={subcategory.id}
                      index={index}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <Button color="default" onClick={onReset}>
              reset
            </Button>
          </div>
          <div className={styles.contentMain}>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className={styles.myMasonryGrid}
              columnClassName={styles.myMasonryGridColumn}
            >
              {sortedCategories.map((category) => (
                <CategoryCard
                  category={category}
                  key={category.id}
                  onCategoryChange={onCategoryChange}
                  isActive={category.id === selectedCategoryId}
                  selectedItem={selectedItems[category.id]}
                  onRemoveItem={onRemoveItem}
                />
              ))}
            </Masonry>
          </div>
          <div className={styles.contentFooter}>
          <Button
              variant="contained"
              color="primary"
              disabled={isSubmitDisbaled || isSubmiting}
              showSpinner={isSubmiting}
              onClick={onSubmit}
            >
              Send me as an email
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={isSubmitDisbaled || isSubmiting}
              showSpinner={isSubmiting}
              onClick={onSubmit}
            >
              Show me here
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CampingGear;
