import { Form, Space } from "antd";
import React, { FC, memo } from "react";
import { ImageOptions } from "store/modules/form";
import Image from "./image";
import styles from "./index.module.scss";

const { Item } = Form;

/**
 * 图片选择
 */
const ImgSelect: FC<Props> = (props) => {
  const { options } = props;

  return (
    <Space className={styles.imgSelectRow} align="start" wrap size="middle">
      {options.map((option) => {
        return (
          <Item key={option.dataIndex} name={option.dataIndex} noStyle={true}>
            <Image key={option.label} {...option} />
          </Item>
        );
      })}
    </Space>
  );
};

export default memo(ImgSelect);

interface Props {
  options: ImageOptions[];
}
