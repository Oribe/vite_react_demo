import React from "react";
import { FC } from "react";
import styles from "./index.module.scss";

const Container: FC = (props) => {
  return <div className={styles.container}>{props.children}</div>;
};

export default Container;
