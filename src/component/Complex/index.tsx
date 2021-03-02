/**
 * 复合组件
 */

import FormCol from "component/FormCol";
import FormItem from "component/FormItem";
import React, { memo } from "react";
import { FC } from "react";
import { FormItem as FormItemConfig } from "store/modules/form";

const Complex: FC<Props> = (props) => {
  const { config } = props;
  if (!Array.isArray(config)) {
    return null;
  }
  return (
    <>
      {config.map((item) => {
        const {
          label,
          dataIndex,
          associatedDataIndex,
          formItemProps,
          component,
          formItemColProps,
        } = item;
        return (
          <FormCol key={item.dataIndex} {...formItemColProps}>
            <FormItem
              key={dataIndex}
              label={label}
              dataIndex={dataIndex}
              associatedDataIndex={associatedDataIndex}
              component={component}
              {...formItemProps}
            />
          </FormCol>
        );
      })}
    </>
  );
};

export default memo(Complex);

interface Props {
  value?: unknown;
  onChange?: (value?: unknown) => void;
  config?: FormItemConfig["complexConfig"];
}
