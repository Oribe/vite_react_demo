import React, { FC, memo } from "react";
import { ImageOptions } from "store/modules/form";
import styles from "./index.module.scss";

const Image: FC<ImageProps> = (props) => {
  const { label, src, onChange } = props;

  const handleClick = () => {
    onChange && onChange(props.value === 0 ? 1 : 0);
  };

  return (
    <div className={styles.imageSelect} onClick={handleClick}>
      <div
        className={`${styles.imageContainer} ${
          props.value === 1 ? styles.active : ""
        }`}
      >
        <img
          src={src ? "http://localhost:3030/static" + src : src}
          alt={label}
        />
      </div>
      <span>{label}</span>
    </div>
  );
};

export default memo(Image);

interface ImageProps extends ImageOptions {
  value?: number;
  onChange?: (value: number) => void;
}
