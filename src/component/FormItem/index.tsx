/**
 * 表单组件Item
 */

import React, { FC, useCallback } from "react";
import { Form, FormItemProps, Input, Select } from "antd";
import { FormItem as FormItemConfig, isImageOptions } from "store/modules/Form";
import ImgSelect from "component/ImgSelect";
import Complex from "component/Complex";

const { Item } = Form;

const FormItem: FC<Props> = (props) => {
  const { label, component, complexConfig, ...formItemProps } = props;

  /**
   * 组件筛选
   */
  const renderComponent = useCallback(
    (
      comp?: FormItemConfig["component"],
      complexConfig?: FormItemConfig["complexConfig"]
    ) => {
      const { type, props: componentProps } = comp || {};
      const { options } = componentProps || {};

      switch (type?.toUpperCase()) {
        case "input".toUpperCase():
          return <Input {...componentProps} />;
        case "select".toUpperCase():
          if (options && !isImageOptions(options)) {
            return <Select {...componentProps} options={options} />;
          }
          return <Select {...componentProps} options={[]} />;
        case "imgSelect".toUpperCase():
          if (options && isImageOptions(options)) {
            return <ImgSelect options={options} />;
          }
          return null;
        case "complex".toLocaleUpperCase():
          return <Complex config={complexConfig} />;
        default:
          return null;
      }
    },
    []
  );

  return (
    <Item label={label} required {...formItemProps}>
      {renderComponent(component, complexConfig) || props.children}
    </Item>
  );
};

export default FormItem;

type Props = {
  label?: string;
  name?: string;
  component?: FormItemConfig["component"];
  complexConfig?: FormItemConfig["complexConfig"];
} & FormItemProps;
