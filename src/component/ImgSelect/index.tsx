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
        if (idx === 0) {
          return (
            <Item
              key={option.dataIndex}
              noStyle={true}
              dependencies={dataIndexs}
              hasFeedback
              help="必须选择一个"
              validateStatus={"success"}
            >
              {({ getFieldsValue }) => {
                const values = getFieldsValue(dataIndexs);

                return (
                  <Item noStyle={true} name={option.dataIndex}>
                    <Image key={option.label} {...option} />
                  </Item>
                );
              }}
            </Item>
          );
        }
        return (
          <Item key={option.dataIndex} noStyle={true} dependencies={dataIndexs}>
            {({ getFieldsValue }) => {
              const values = getFieldsValue(dataIndexs);

              return (
                <Item noStyle={true} name={option.dataIndex}>
                  <Image key={option.label} {...option} />
                </Item>
              );
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
