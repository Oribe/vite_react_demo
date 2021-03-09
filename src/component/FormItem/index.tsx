/**
 * 表单组件Item
 */

import { Form, FormItemProps } from "antd";
import ImageHint from "component/ImageHint";
import React, { FC, memo, useRef, useState } from "react";
import { Component, FormItem as FormItemConfig } from "store/modules/form";
import useFormItemProps from "./hooks/formItemProps";
import RenderComponent from "./hooks/renderComp";
import styles from "./index.module.scss";

const { Item } = Form;

const FormItem: FC<Props> = (props) => {
  const {
    label,
    dataIndex,
    associatedDataIndex,
    hintImgUrl,
    component,
    complexConfig,
    ...formItemProps
  } = props;
  /**
   * 记录被关联字段的值
   */
  const [associatedValue, setAssociatedValue] = useState();
  /**
   * 记录是否第一次渲染
   * 防止当表单有初始值时，关联字段的值会被重置
   */
  const [isFirstRender, setIsFirstRender] = useState(true);
  const timerRef = useRef<number>();
  const [_formItemProps] = useFormItemProps({
    label,
    dataIndex,
    type: component?.type,
    formItemProps,
  });

  if (associatedDataIndex) {
    /**
     * 当有关联字段时
     */
    const { style, ...otherFormItemProps } = _formItemProps;
    return (
      <Item noStyle style={style} dependencies={associatedDataIndex}>
        {({ getFieldValue, resetFields }) => {
          timerRef.current = setTimeout(() => {
            /**
             * 获取当前被关联字段的值
             */
            const _associatedValue = getFieldValue(
              associatedDataIndex[associatedDataIndex.length - 1]
            );
            if (
              otherFormItemProps?.name &&
              associatedValue !== _associatedValue
            ) {
              /**
               * 关联字段值发生改变
               */
              setAssociatedValue(_associatedValue);
              setIsFirstRender(false);
              if (!isFirstRender) {
                resetFields([otherFormItemProps.name]);
              }
            }
            clearTimeout(timerRef.current);
          });
          let associatedValues: (string | number)[] | undefined;
          if (associatedDataIndex) {
            associatedValues = associatedDataIndex.map((field) =>
              getFieldValue(field)
            );
          }
          return (
            <Item label={label} required {...otherFormItemProps}>
              <RenderComponent
                comp={component}
                other={{
                  complexConfig,
                  associatedValues: associatedValues,
                }}
              />
            </Item>
          );
        }}
      </Item>
    );
  }

  /**
   * 无关联字段
   */
  return (
    <>
      <Item label={label} required {..._formItemProps}>
        <RenderComponent comp={component} other={{ complexConfig }} />
      </Item>
      {hintImgUrl ? (
        <ImageHint className={styles.hintImage} url={hintImgUrl} />
      ) : (
        ""
      )}
    </>
  );
};

export default memo(FormItem);

type Props = {
  label?: string;
  name?: string;
  dataIndex?: string;
  hintImgUrl?: string;
  associatedDataIndex?: string[];
  component?: Component;
  complexConfig?: FormItemConfig[];
} & FormItemProps;
