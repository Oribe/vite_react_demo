/**
 * 表单头
 * 固定参数
 */

import { Button } from "antd";
import FormCol from "component/FormCol";
import { debounce } from "lodash-es";
import React, { FC } from "react";
import { FormItem as FormItemConfig } from "store/modules/Form";
import FormItem from "../FormItem";

const Caption: FC<Props> = (props) => {
  const { config, onFormReset, ...funcProps } = props;

  return (
    <>
      {config?.map((item) => {
        const {
          label,
          dataIndex,
          associatedDataIndex,
          formItemProps,
          component,
          formItemColProps,
          complexConfig,
        } = item;
        const { func } = component;
        const newFunc: Record<string, unknown> = {};
        if (func) {
          for (const key in func) {
            const value = func[key];
            if (!value) continue; // false跳过
            let f;
            if (typeof value === "boolean") {
              /**
               * 为布尔值
               */
              f = Object.getOwnPropertyDescriptor(funcProps, key)?.value;
            }
            if (typeof value === "string") {
              /**
               * 为字符串
               * 指定了函数名
               */
              f = Object.getOwnPropertyDescriptor(funcProps, value)?.value;
            }
            if (typeof f === "function") {
              newFunc[key] = debounce(f, 500);
            }
          }
        }
        return (
          <FormCol key={item.label} {...formItemColProps}>
            <FormItem
              label={label}
              dataIndex={dataIndex}
              associatedDataIndex={associatedDataIndex}
              component={{ ...component, func: newFunc }}
              complexConfig={complexConfig}
              {...formItemProps}
            />
          </FormCol>
        );
      })}
      <div>
        <Button onClick={onFormReset}>重置</Button>
      </div>
    </>
  );
};

export default Caption;

interface Props {
  config?: FormItemConfig[];
  onFormReset?: () => void;
  onSearchOrderNumber?: (orderNumber: string) => void;
}
