/**
 * 表单组件Item
 */

import { Form, FormItemProps } from "antd";
import ImageHint from "component/ImageHint";
import React, { FC, memo } from "react";
import { Component, FormItem as FormItemConfig } from "store/modules/form";
import CompoentWithAssociate from "./components/CompoentWithAssociate";
import SwitchComponent from "./components/RenderComponent";
import useFunc from "./hooks/useFunc";
import useName from "./hooks/useName";
import useRules from "./hooks/useRules";
import styles from "./index.module.scss";

const { Item } = Form;

type Props = {
  label?: string;
  name?: string;
  dataIndex?: string;
  hintImgUrl?: string;
  associatedDataIndex?: string[];
  component?: Component;
  complexConfig?: FormItemConfig[];
} & FormItemProps;

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

  const itemPropsWithNewRules = useRules(label, component?.type, formItemProps);
  const itemPropsWithName = useName(
    dataIndex,
    component?.type,
    itemPropsWithNewRules
  );
  const newFormItemProps = useFunc(itemPropsWithName);

  if (associatedDataIndex) {
    /**
     * 当有关联字段时
     */

    return (
      <CompoentWithAssociate
        label={label}
        associatedDataIndex={associatedDataIndex}
        itemProps={newFormItemProps}
        component={component}
        complexConfig={complexConfig}
      />
    );
  }
  /**
   * 无关联字段
   */
  return (
    <>
      <Item label={label} required {...newFormItemProps}>
        <SwitchComponent comp={component} other={{ complexConfig }} />
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
