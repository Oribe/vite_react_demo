/**
 *
 */

import { Form } from "antd";
import React, { FC } from "react";
import EditableContext from "./editableContext";

const { Provider } = EditableContext;

const EditableRow: FC<Props> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form key={index} form={form} component={false}>
      <Provider value={form}>
        <tr {...props} />
      </Provider>
    </Form>
  );
};

export default EditableRow;

interface Props {
  index: number;
}
