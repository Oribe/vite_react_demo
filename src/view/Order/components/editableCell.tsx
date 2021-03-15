/**
 * 用户编辑数量的组件
 */

import { Form, InputNumber } from "antd";
import React, { FC, memo, useContext, useEffect, useMemo } from "react";
import EditableContext from "./editableContext";

const { Item } = Form;

const EditableCell: FC<EditableCellProps> = (props) => {
  const {
    title,
    dataIndex,
    record,
    editable,
    children,
    handleSave,
    ...restProps
  } = props;
  const form = useContext(EditableContext);

  useEffect(() => {
    form?.setFieldsValue({ [dataIndex]: record?.[dataIndex] });
  }, [dataIndex, form, record]);

  const childNode = useMemo(() => {
    if (editable) {
      return (
        <Item
          style={{ margin: 0, padding: 0 }}
          name={dataIndex}
          rules={[
            { required: true, message: "请输入数量" },
            { type: "number", message: "必须为数字" },
          ]}
        >
          <InputNumber />
        </Item>
      );
    }
    return <div>{children}</div>;
  }, [children, dataIndex, editable]);

  return <td {...restProps}>{childNode}</td>;
};

export default memo(EditableCell);

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof ItemType;
  record: ItemType;
  handleSave: (record: ItemType) => void;
}

interface ItemType {
  key: string;
  name: string;
  age: string;
  address: string;
}
