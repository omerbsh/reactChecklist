import React from "react";
import styles from "./style.module.css";

const Error = ({ message }) => {
  return <p className={styles.error}>{message}</p>;
};

export default Error;
