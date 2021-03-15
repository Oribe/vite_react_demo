import React, { FC } from "react";
import styles from "./index.module.scss";

const Container: FC = (props) => {
  const { children } = props;
  return <div className={styles.container}>{children}</div>;
};

export default Container;
