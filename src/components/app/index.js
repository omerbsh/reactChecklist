import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Loader from "react-loader-spinner";
import { DragDropContext } from "react-beautiful-dnd";
import isEmpty from "lodash/isEmpty";
import Error from "components/error";
import CampingGear from "components/campingGear";
import { transformCategoriesResponse } from "utils";
import styles from "./style.module.css";

const APP_STATUS = {
  IDLE: "IDLE",
  LOADING: "LOADING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

const App = () => {
  const [status, setStatus] = useState(APP_STATUS.IDLE);
  const [categories, setCategories] = useState(null); // whole app data loaded from api
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // selcted category id

  const [selectedItems, setSeletedItems] = useState({});
  const [isDisabled, setIsDisabled] = useState(true); // disable the submit buton if seleted items are empty

  const [open, setOpen] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const handleCategoryChange = (id) => {
    setSelectedCategoryId(id);
  };

  useEffect(() => {
    if (status === APP_STATUS.SUCCESS) {
      const key = localStorage.getItem("isVisted");

      if (!key) {
        localStorage.setItem("isVisted", "visted");
        setOpen(true);
      }
    }
  }, [status]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus(APP_STATUS.LOADING);
        const response = await axios({
          method: "GET",
          url: "https://campingsnail.com/campingGearCategories.json",
          transformResponse: transformCategoriesResponse,
        });
        setCategories(response.data);

        const keys = Object.keys(response.data);
        let foundSelectedCategory = null;

        keys.forEach((key) => {
          if (response.data[key].precedence === 0) {
            foundSelectedCategory = response.data[key];
          }
        });

        setSelectedCategoryId(foundSelectedCategory.id);
        setStatus(APP_STATUS.SUCCESS);
      } catch (err) {
        setStatus(APP_STATUS.ERROR);
      }
    };

    fetchData();
  }, []);

  const onDragEnd = (result) => {
    const { draggableId, destination } = result;

    if (!destination || destination.droppableId === "sidebar") return;

    const newCategories = {
      ...categories,
      [destination.droppableId]: {
        ...categories[destination.droppableId],
        subcategories: {
          ...categories[destination.droppableId].subcategories,
          [draggableId]: {
            ...categories[destination.droppableId].subcategories[draggableId],
          },
        },
      },
    };

    const newSelectedItems = {
      ...selectedItems,
    };

    if (newSelectedItems[destination.droppableId]) {
      if (newSelectedItems[destination.droppableId].subcategories) {
        newSelectedItems[destination.droppableId].subcategories = {
          ...newSelectedItems[destination.droppableId].subcategories,
          [draggableId]: {
            ...categories[destination.droppableId].subcategories[draggableId],
          },
        };
      } else {
        newSelectedItems[destination.droppableId].subcategories = {
          [draggableId]: {
            ...categories[destination.droppableId].subcategories[draggableId],
          },
        };
      }
    } else {
      newSelectedItems[destination.droppableId] = {
        ...categories[destination.droppableId],
        subcategories: {
          [draggableId]: {
            ...categories[destination.droppableId].subcategories[draggableId],
          },
        },
      };
    }

    delete newCategories[destination.droppableId].subcategories[draggableId];

    setIsDisabled(false);
    setSeletedItems(newSelectedItems);
    setCategories(newCategories);
  };

  const handleRemoveItem = (categoryId, subcategorieId) => {
    const newSelectedItems = {
      ...selectedItems,
      [categoryId]: {
        ...selectedItems[categoryId],
        subcategories: {
          ...selectedItems[categoryId].subcategories,
          [subcategorieId]: {
            ...selectedItems[categoryId].subcategories[subcategorieId],
          },
        },
      },
    };

    const newCategories = {
      ...categories,
      [categoryId]: {
        ...categories[categoryId],
      },
    };

    newCategories[categoryId].subcategories = {
      ...newCategories[categoryId].subcategories,
      [subcategorieId]: {
        ...selectedItems[categoryId].subcategories[subcategorieId],
      },
    };

    delete newSelectedItems[categoryId].subcategories[subcategorieId];

    let isSelectedItemsEmpty = true;
    const newKeys = Object.keys(newSelectedItems);

    for (let i = 0; i < newKeys.length; i++) {
      const key = newKeys[i];
      const category = newSelectedItems[key];
      if (!isEmpty(category.subcategories)) {
        isSelectedItemsEmpty = false;
        break;
      }
    }

    if (isSelectedItemsEmpty) {
      setIsDisabled(true);
    }

    setSeletedItems(newSelectedItems);
    setCategories(newCategories);
  };

  const resetState = () => {
    const selectedKeys = Object.keys(selectedItems);

    const newCategories = {
      ...categories,
    };

    selectedKeys.forEach((selectedKey) => {
      const selectedItem = selectedItems[selectedKey];

      newCategories[selectedKey] = {
        ...newCategories[selectedKey],
      };

      newCategories[selectedKey].subcategories = {
        ...newCategories[selectedKey].subcategories,
        ...selectedItem.subcategories,
      };
    });

    // change the selected category to default 1
    const keys = Object.keys(newCategories);
    let foundSelectedCategory = null;

    keys.forEach((key) => {
      if (newCategories[key].precedence === 0) {
        foundSelectedCategory = newCategories[key];
      }
    });

    setSelectedCategoryId(foundSelectedCategory.id);
    setSeletedItems({});
    setCategories(newCategories);
  };

  const handleSubmit = () => {
    setIsSubmiting(true);

    const data = {};

    const keys = Object.keys(selectedItems);

    keys.forEach((key) => {
      const category = selectedItems[key];

      if (!isEmpty(category.subcategories)) {
        const subKeys = Object.keys(category.subcategories);
        const newSubcategories = [];
        subKeys.forEach((subKey) => {
          newSubcategories.push(category.subcategories[subKey].name);
        });

        data[category.name] = newSubcategories;
      }
    });

    // setTimeout is used here to mock the API request, remove the setTimeout and call the API, and when the response is successfull update the state accordingly as in the setTimeout the state is updated. Other wise show some toast with some message.

    /** === Request Body Structure ===
     * {
     *  categoryName: ['subcategory1, subcategory2,...subcategoryn']
     * }
     */

    /** === Example ===
     * Let's say that from tent two items are selected Hammer and Stakes, and from planning one item is selected Arrange Transportation in this case the request body structure will be
     *
     * {
     *  Tent: ["Hammer", "Stakes"],
     *  Planning: ["Arrange Transportation"]
     * }
     */

    setTimeout(() => {
      // TODO: show some toast or popup with success message
      setIsSubmiting(false);
      resetState();
    }, 4000);
  };

  let outputJsx = null;
  if (status === APP_STATUS.IDLE) {
    outputJsx = null;
  } else if (status === APP_STATUS.ERROR) {
    outputJsx = (
      <div className={styles.screenCenter}>
        <Error message="Something went wrong, please try again latter." />
      </div>
    );
  } else if (status === APP_STATUS.LOADING) {
    outputJsx = (
      <div className={styles.screenCenter}>
        <div className={styles.loaderBox}>
          <Loader type="ThreeDots" height={40} width={40} />
        </div>
      </div>
    );
  } else if (status === APP_STATUS.SUCCESS) {
    outputJsx = (
      <DragDropContext onDragEnd={onDragEnd}>
        <CampingGear
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={handleCategoryChange}
          selectedItems={selectedItems}
          onRemoveItem={handleRemoveItem}
          isSubmitDisbaled={isDisabled}
          isSubmiting={isSubmiting}
          onSubmit={handleSubmit}
          onReset={resetState}
        />
      </DragDropContext>
    );
  }

  return (
    <>
      {/* This div will be used to block the UI so that the user can not interact with the app until the send resuest is finished */}
      {isSubmiting && <div className={styles.blockUi} />} {outputJsx}
      <Modal
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        contentLabel="How it works?"
        styles={customStyles}
        className={styles.modal}
      >
        <div className={styles.ModalHeader}>
          <span>How it works</span>
          <button onClick={() => setOpen(false)}>X</button>
        </div>

        <div className={styles.ModalBody}>
          {/* Put your content here  */} Put message here
        </div>
      </Modal>
    </>
  );
};

export default App;
