/**
 * 表单组件Item
 */

import { Form, FormItemProps } from "antd";
import React, { FC, memo } from "react";
import { FormItem as FormItemConfig } from "store/modules/Form";
import useFormItemProps from "./hooks/formItemProps";
import useRenderComponent from "./hooks/renderComp";

const { Item } = Form;

const FormItem: FC<Props> = (props) => {
  const {
    label,
    dataIndex,
    component,
    complexConfig,
    ...formItemProps
  } = props;

  const [comp] = useRenderComponent(component, complexConfig);
  const [_formItemProps] = useFormItemProps({
    label,
    dataIndex,
    type: component?.type,
    formItemProps,
  });

  // if (component?.type === "imgSelect") {
  //   /**
  //    * 单独处理图片选择
  //    * 至少选择一种
  //    */
  //   console.log("newFormItemProps", newFormItemProps);
  // }

  // if (component?.type === "imgSelect") {
  //   console.log("imgSelect", _formItemProps);
  //   delete _formItemProps.name;
  // }

  // if (component?.type === "complex") {
  //   console.log("complex", _formItemProps);
  //   delete _formItemProps.name;
  // }

  console.log(_formItemProps);

  return (
    <Item label={label} required {..._formItemProps}>
      {comp || props.children}
    </Item>
  );
};

export default memo(FormItem);

type Props = {
  label?: string;
  name?: string;
  dataIndex?: string;
  component?: FormItemConfig["component"];
  complexConfig?: FormItemConfig["complexConfig"];
} & FormItemProps;
