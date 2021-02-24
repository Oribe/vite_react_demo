/**
 * 表单组件Item
 */

import { Form, FormItemProps } from "antd";
import ImageHint from "component/ImageHint";
import React, { FC, memo, useRef, useState } from "react";
import { Component, FormItem as FormItemConfig } from "store/modules/Form";
import useFormItemProps from "./hooks/formItemProps";
import renderComponent from "./hooks/renderComp";
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
  const [associatedValue, setAssociatedValue] = useState();
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
            const _associatedValue = getFieldValue(
              associatedDataIndex[associatedDataIndex.length - 1]
            );
            if (
              otherFormItemProps?.name &&
              associatedValue !== _associatedValue
            ) {
              setAssociatedValue(_associatedValue);
              resetFields([otherFormItemProps.name]);
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

  /**
   * 无关联字段
   */
  return (
    <>
      <Item label={label} required {..._formItemProps}>
        {renderComponent(component, { complexConfig }) || props.children}
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
