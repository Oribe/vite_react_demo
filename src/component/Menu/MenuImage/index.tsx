import React, { FC } from "react";
import { ImageProps } from "route/index";
import styles from "./index.module.scss";

const MenuImage: FC<ImageProps> = (props) => {
  const { src } = props;
  if (!src) {
    return null;
  }
  return (
    <div className={styles.menuImageWrapper}>
      <img alt="" {...props} />
    </div>
  );
};

export default MenuImage;
