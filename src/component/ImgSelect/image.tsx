import React, { FC, memo, useEffect } from "react";
import { ImageOptions } from "store/modules/form";
import styles from "./index.module.scss";

const Image: FC<ImageProps> = (props) => {
  const { label, src, onChange, value } = props;

  const handleClick = () => {
    if (onChange) {
      onChange((props.value || 0) === 0 ? 1 : 0);
    }
  };

  useEffect(() => {
    if (value === undefined && onChange) {
      onChange(0);
    }
  }, [onChange, value]);

  return (
    <div
      className={styles.imageSelect}
      onClick={handleClick}
      aria-hidden="true"
    >
      <div
        className={`${styles.imageContainer} ${
          (value || 0) === 1 ? styles.active : ""
        }`}
      >
        <img
          src={src ? `http://localhost:3030/static${src}` : src}
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
