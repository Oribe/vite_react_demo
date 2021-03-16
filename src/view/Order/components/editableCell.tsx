/**
 * 用户编辑数量的组件
 */

import { Form, InputNumber } from "antd";
import React, {
  FC,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { Cutter } from "store/modules/order";
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

  const onSave = useCallback(async () => {
    try {
      const value = await form?.validateFields();
      if (value && handleSave) {
        handleSave({ ...record, ...value });
      }
    } catch (e) {
      console.error(e);
    }
  }, [form, handleSave, record]);

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
          <InputNumber min={1} onPressEnter={onSave} onBlur={onSave} />
        </Item>
      );
    }
    return <div>{children}</div>;
  }, [children, dataIndex, editable, onSave]);

  return <td {...restProps}>{childNode}</td>;
};

export default memo(EditableCell);

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof ItemType;
  record: ItemType;
  handleSave: (record: Cutter) => void;
}

interface ItemType {
  key: string;
  name: string;
  age: string;
  address: string;
}
