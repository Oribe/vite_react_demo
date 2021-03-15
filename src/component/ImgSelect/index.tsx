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
      {options.map((option, idx) => {
        return (
          <Item
            key={option.dataIndex}
            noStyle
            dependencies={dataIndexs}
            name={option.dataIndex}
            rules={[
              ({ getFieldsValue }) => ({
                validator() {
                  if (idx === 0) {
                    const values = getFieldsValue(dataIndexs);
                    if (Object.values(values).includes(1)) {
                      // 至少选择了一种
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("至少选择一种"));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
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
