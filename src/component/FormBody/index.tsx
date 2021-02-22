/**
 * 表单内容
 */

import React, { FC, memo } from "react";
import { FormItem as FormItemConfig } from "store/modules/Form";
import FormCol from "../FormCol";
import FormItem from "../FormItem";

const FormBody: FC<Props> = (props) => {
  const { body } = props;

  return (
    <>
      <FormCol xs={24} sm={24}>
        <h3>刀具参数</h3>
      </FormCol>
      {body.map((item) => {
        const {
          label,
          dataIndex,
          associatedDataIndex,
          formItemProps,
          component,
          formItemColProps,
          complexConfig,
        } = item;

        return (
          <FormCol key={item.label} {...formItemColProps}>
            <FormItem
              label={label}
              dataIndex={dataIndex}
              associatedDataIndex={associatedDataIndex}
              component={component}
              complexConfig={complexConfig}
              {...formItemProps}
            />
          </FormCol>
        );
      })}
    </>
  );
};

export default memo(FormBody);

interface Props {
  body: FormItemConfig[];
}
