/**
 * 表单组件Item
 */

import React, { FC } from "react";
import { Form, FormItemProps } from "antd";

const { Item } = Form;

const FormItem: FC<Props> = (props) => {
  const { label, dataIndex, ...formItemProps } = props;
  return (
    <Item label={label} name={dataIndex} {...formItemProps}>
      {props.children}
    </Item>
  );
};

export default FormItem;

type Props = {
  label?: string;
  dataIndex?: string;
} & FormItemProps;
