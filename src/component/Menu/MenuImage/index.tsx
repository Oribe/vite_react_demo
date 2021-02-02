import React, { FC } from "react";
import { ImageProps } from "route/index";
import styles from "./index.module.scss";

const MenuImage: FC<ImageProps> = (props) => {
  if (!props.src) {
    return null;
  }
  return (
    <div className={styles.menuImageWrapper}>
      <img {...props} />
    </div>
  );
};

export default MenuImage;
