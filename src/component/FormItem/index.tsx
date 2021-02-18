/**
 * 表单组件Item
 */

import React, {
  FC,
  useCallback,
  useEffect,
  useState,
  memo,
  useMemo,
} from "react";
import { Form, FormItemProps, Input, Select } from "antd";
import { FormItem as FormItemConfig, isImageOptions } from "store/modules/Form";
import ImgSelect from "component/ImgSelect";
import Complex from "component/Complex";
import { Rule } from "antd/lib/form";
import { isFunction } from "lodash-es";
import { switchTypeToMessage } from "utils/index";

const { Item } = Form;

const FormItem: FC<Props> = memo((props) => {
  const {
    label,
    component,
    dataIndex,
    complexConfig,
    name,
    ...formItemProps
  } = props;

  /**
   * 组件筛选
   * 返回对应的表单组件
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

  /**
   * rule检验调整
   */
  const addRuleMessage = useCallback(
    (ruleList: Rule[], label?: string, componentType?: string) => {
      return Object.assign<Rule[], Rule[]>([], ruleList).map((rule) => {
        if (isFunction(rule)) {
          /**
           * 如果当前规则为函数
           * 则直接返回这个函数
           */
          return rule;
        }
        const { type, message } = rule;
        if (message) {
          // 如果存在消息提示
          return rule;
        }
        if (type) {
          /**
           * 如果存在类型
           */
          return { ...rule, message: switchTypeToMessage(type) };
        }
        if ("required" in rule) {
          if (componentType === "select") {
            return { ...rule, message: "请选择" + label };
          }
          return { ...rule, message: "请输入" + label };
        }
        return rule;
      });
    },
    []
  );

  const newFormItemProps = useMemo(() => {
    /**
     * 将检验规则信息补全完整
     */
    const rules = addRuleMessage(
      formItemProps?.rules || [],
      label,
      component?.type
    );
    /**
     * 重新组合新的传递参数
     */
    if (dataIndex && component?.type !== "complex") {
      /**
       * 如果组件类型不等于复合组件
       * 删除name字段
       */
      return {
        ...formItemProps,
        // name: dataIndex,
        rules,
      };
    } else if (dataIndex) {
      return {
        ...formItemProps,
        name: dataIndex || name,
        rules,
      };
    } else {
      return {
        ...formItemProps,
        name: dataIndex || name,
        rules,
      };
    }
  }, [addRuleMessage, component?.type, dataIndex, formItemProps, label, name]);

  console.log("newFormItemProps", newFormItemProps);

  return (
    <Item label={label} required {...newFormItemProps}>
      {renderComponent(component, complexConfig) || props.children}
    </Item>
  );
});

export default FormItem;

type Props = {
  label?: string;
  name?: string;
  dataIndex?: string;
  component?: FormItemConfig["component"];
  complexConfig?: FormItemConfig["complexConfig"];
} & FormItemProps;
