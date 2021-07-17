import React from "react";
import Loader from "react-loader-spinner";
import styles from "./style.module.css";

const Button = ({
  children,
  color = "default",
  variant,
  showSpinner,
  ...otherProps
}) => {
  const getClassNames = () => {
    const classNames = [styles.button];

    if (!variant) {
      if (color === "default") classNames.push(styles.default);
    } else if (variant === "contained" && color === "primary")
      classNames.push(styles.containedPrimary);

    return classNames.join(" ");
  };

  return (
    <button className={getClassNames()} {...otherProps}>
      <>
        {showSpinner ? (
          <Loader
            type="ThreeDots"
            height={20}
            width={20}
            className={styles.loader}
          />
        ) : (
          <>{children}</>
        )}
      </>
    </button>
  );
};

export default Button;
