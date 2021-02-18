/**
 * 复合组件
 */

import FormItem from "component/FormItem";
import React from "react";
import { FC } from "react";
import { FormItem as FormItemConfig } from "store/modules/Form";

const Complex: FC<Props> = (props) => {
  const { config } = props;
  if (!Array.isArray(config)) {
    return null;
  }
  return (
    <>
      {config.map((item) => {
        const { label, dataIndex, formItemProps, component } = item;
        return (
          <FormItem
            key={dataIndex}
            label={label}
            name={dataIndex}
            component={component}
            {...formItemProps}
          />
        );
      })}
    </>
  );
};

export default Complex;

interface Props {
  value?: any;
  onChange?: (value?: any) => void;
  config?: FormItemConfig["complexConfig"];
}
