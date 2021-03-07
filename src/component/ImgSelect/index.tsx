import { Form, Space } from "antd";
import React, { FC, memo, useMemo } from "react";
import { ImageOptions } from "store/modules/form";
import Image from "./image";
import styles from "./index.module.scss";

const { Item } = Form;

/**
 * 图片选择
 */
const ImgSelect: FC<Props> = (props) => {
  const { options } = props;

  /**
   * 获取关联字段
   */
  const dataIndexs = useMemo(() => options.map((item) => item.dataIndex), [
    options,
  ]);

  return (
    <Space className={styles.imgSelectRow} align="start" wrap size="middle">
      {options.map((option) => {
        return (
          <Item
            key={option.dataIndex}
            name={option.dataIndex}
            noStyle={true}
            dependencies={dataIndexs}
          >
            {({ getFieldsValue }) => {
              const values = getFieldsValue(dataIndexs);
              console.log("values", values);
              return <Image key={option.label} {...option} />;
            }}
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
