import { v4 as uuid } from "uuid";

// transforms categories response to the following structure
/**
 * id: {
 *    name,
 *    id,
 *    precedence,
 *    subcategories {
 *        id,
 *        categoryId,
 *        name,
 *        precedence
 *    }
 * }
 */

export const transformCategoriesResponse = (data) => {
  const parsedData = JSON.parse(data);
  const categories = {};

  const categoryKeys = Object.keys(parsedData);

  categoryKeys.forEach((categoryKey, categoryIndex) => {
    const subcategories = parsedData[categoryKey];
    const categoryId = uuid();
    const newSubcategories = {};

    subcategories.forEach((subcategory, subcategoryIndex) => {
      const subcategoryId = uuid();

      newSubcategories[subcategoryId] = {
        id: subcategoryId,
        categoryId,
        name: subcategory,
        precedence: subcategoryIndex,
      };
    });

    categories[categoryId] = {
      id: categoryId,
      name: categoryKey,
      subcategories: newSubcategories,
      precedence: categoryIndex,
    };
  });

  return categories;
};
