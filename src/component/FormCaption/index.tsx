/**
 * 表单头
 * 固定参数
 */

import { Button, Col, Row } from "antd";
import FormCol from "component/FormCol";
import React, { FC, useCallback } from "react";
import {
  ComponentFunc,
  ComponentFuncConfig,
  FormItem as FormItemConfig,
  isComponentFuncConfig,
} from "store/modules/Form";
import { reCreateFunc } from "utils/index";
import FormItem from "../FormItem";
import styles from "./index.module.scss";

const Caption: FC<Props> = (props) => {
  const { config, onFormReset, ...funcProps } = props;

  const handleReCreateFunc = useCallback(
    (funcObj?: ComponentFuncConfig) => {
      if (funcObj) {
        return reCreateFunc(funcObj, funcProps, true);
      }
      return {};
    },
    [funcProps]
  );

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
        let newFuncObj: ComponentFunc = {};
        if (isComponentFuncConfig(func)) {
          newFuncObj = handleReCreateFunc(func);
        }
        return (
          <FormCol key={item.label} {...formItemColProps}>
            <FormItem
              label={label}
              dataIndex={dataIndex}
              associatedDataIndex={associatedDataIndex}
              component={{ ...component, func: newFuncObj }}
              complexConfig={complexConfig}
              {...formItemProps}
            />
          </FormCol>
        );
      })}
      <Col span={24} className={styles.btnGroupWrapper}>
        <Row justify="center">
          <Col>
            <Button
              className={styles.formResetBtn}
              size="middle"
              onClick={onFormReset}
            >
              自动解码输入
            </Button>
          </Col>
          <Col offset={1}>
            <Button
              className={styles.formResetBtn}
              size="middle"
              onClick={onFormReset}
            >
              一键清空
            </Button>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Caption;

interface Props {
  config?: FormItemConfig[];
  onFormReset?: () => void;
  onSearchOrderNumber?: (orderNumber: string) => void;
}
