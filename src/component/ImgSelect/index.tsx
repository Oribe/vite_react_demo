import { Row } from "antd";
import React, { FC } from "react";
import { ImageOptions } from "store/modules/Form";
import { Form } from "antd";
import styles from "./index.module.scss";

const { Item } = Form;

const Image: FC<ImageOptions> = (props) => {
  const { label, src, dataIndex } = props;
  return (
    <Item name={dataIndex}>
      <div className={styles.imageSelect}>
        <img
          src={src ? "http://localhost:3030/static" + src : src}
          alt={label}
        />
        <span>{label}</span>
      </div>
    </Item>
  );
};

/**
 * 图片选择
 */
const ImgSelect: FC<Props> = (props) => {
  const { options } = props;

  return (
    <Row>
      {options.map((option) => {
        return <Image key={option.label} {...option} />;
      })}
    </Row>
  );
};

export default ImgSelect;

interface Props {
  options: ImageOptions[];
}
