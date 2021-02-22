/**
 * 表单组件Item
 */

import { Form, FormItemProps } from "antd";
import React, { FC, memo } from "react";
import { Component, FormItem as FormItemConfig } from "store/modules/Form";
import useFormItemProps from "./hooks/formItemProps";
import renderComponent from "./hooks/renderComp";

const { Item } = Form;

const FormItem: FC<Props> = (props) => {
  const {
    label,
    dataIndex,
    associatedDataIndex,
    component,
    complexConfig,
    ...formItemProps
  } = props;

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

  if (associatedDataIndex) {
    const { style, ...otherFormItemProps } = _formItemProps;
    return (
      <Item noStyle style={style} dependencies={associatedDataIndex}>
        {({ getFieldValue }) => {
          let associatedValues: (string | number)[] | undefined;
          if (associatedDataIndex) {
            associatedValues = associatedDataIndex.map((field) =>
              getFieldValue(field)
            );
          }
          return (
            <Item label={label} required {...otherFormItemProps}>
              {renderComponent(component, {
                complexConfig,
                associatedValues: associatedValues,
              }) || props.children}
            </Item>
          );
        }}
      </Item>
    );
  }

  return (
    <Item label={label} required {..._formItemProps}>
      {renderComponent(component, { complexConfig }) || props.children}
    </Item>
  );
};

export default memo(FormItem);

type Props = {
  label?: string;
  name?: string;
  dataIndex?: string;
  associatedDataIndex?: string[];
  component?: Component;
  complexConfig?: FormItemConfig[];
} & FormItemProps;
