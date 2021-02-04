import { Row } from "antd";
import React, { FC, useEffect, useState } from "react";
import { ImageOptions } from "store/modules/Form";
import { Form } from "antd";
import styles from "./index.module.scss";

const { Item } = Form;

const Image: FC<ImageProps> = (props) => {
  const [value, setValue] = useState(0);
  const { label, src, onChange } = props;

  const handleClick = () => {
    setValue(value === 0 ? 1 : 0);
  };

  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
  }, [onChange, value]);

  return (
    <div className={styles.imageSelect} onClick={handleClick}>
      <img src={src ? "http://localhost:3030/static" + src : src} alt={label} />
      <span>{label}</span>
    </div>
  );
};

/**
 * 图片选择
 */
const ImgSelect: FC<Props> = (props) => {
  const { options } = props;
  return (
    <Row justify="space-around">
      {options.map((option) => {
        return (
          <Item key={option.dataIndex} name={option.dataIndex} noStyle={true}>
            <Image key={option.label} {...option} />
          </Item>
        );
      })}
    </Row>
  );
};

export default ImgSelect;

interface Props {
  options: ImageOptions[];
}

interface ImageProps extends ImageOptions {
  onChange?: (value: number) => void;
}