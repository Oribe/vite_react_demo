import { Form, FormItemProps } from "antd";
import React, { FC, memo, useCallback, useRef, useState } from "react";
import { Component, FormItem } from "store/modules/form";
import SwitchComponent from "../RenderComponent";

const { Item } = Form;

interface Props {
  label?: string;
  associatedDataIndex: string[];
  itemProps?: FormItemProps;
  component?: Component;
  complexConfig?: FormItem[];
}

const CompoentWithAssociate: FC<Props> = memo((props) => {
  /**
   * 字段是否为必填
   */
  const [isRequired, setIsRequired] = useState(true);
  /**
   * 记录被关联字段的值
   */
  const [associatedValue, setAssociatedValue] = useState();
  /**
   * 记录是否第一次渲染
   * 防止当表单有初始值时，关联字段的值会被重置
   */
  const [isFirstRender, setIsFirstRender] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | number>();

  const {
    label,
    associatedDataIndex,
    itemProps,
    component,
    complexConfig,
  } = props;

  /**
   * 获取子组件disbale状态
   */
  const handleChildrenDisable = useCallback((disable: boolean) => {
    setIsRequired(!disable);
  }, []);

  return (
    <Item noStyle dependencies={associatedDataIndex}>
      {({ getFieldValue, resetFields }) => {
        timerRef.current = setTimeout(() => {
          /**
           * 获取当前被关联字段的值
           */
          const newAssociatedValue = getFieldValue(
            associatedDataIndex[associatedDataIndex.length - 1]
          );
          if (itemProps?.name && associatedValue !== newAssociatedValue) {
            /**
             * 关联字段值发生改变
             */
            setAssociatedValue(newAssociatedValue);
            setIsFirstRender(false);
            if (!isFirstRender) {
              resetFields([itemProps.name]);
            }
          }
          clearTimeout(
            typeof timerRef.current === "number" ? timerRef.current : undefined
          );
        });
        let associatedValues: (string | number)[] | undefined;
        if (associatedDataIndex) {
          associatedValues = associatedDataIndex.map((field) =>
            getFieldValue(field)
          );
        }
        return (
          <Item
            label={label}
            required={isRequired}
            {...itemProps}
            rules={isRequired ? itemProps?.rules : undefined}
          >
            <SwitchComponent
              comp={component}
              other={{
                complexConfig,
                associatedValues,
              }}
              onDisableChange={handleChildrenDisable}
            />
          </Item>
        );
      }}
    </Item>
  );
});

export default CompoentWithAssociate;
