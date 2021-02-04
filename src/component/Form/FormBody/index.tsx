/**
 * 表单内容
 */

import { Col, Input, Select } from "antd";
import { Rule } from "antd/lib/form";
import ImgSelect from "component/ImgSelect";
import { isFunction } from "lodash-es";
import React, { FC, useCallback } from "react";
import { FormItem as FormItemConfig, isImageOptions } from "store/modules/Form";
import { switchTypeToMessage } from "utils/index";
import FormCol from "../FormCol";
import FormItem from "../FormItem";

const FormBody: FC<Props> = (props) => {
  const { body } = props;

  /**
   * 组件筛选
   */
  const renderComponent = useCallback((comp: FormItemConfig["component"]) => {
    const { type, props: componentProps } = comp;
    const { options } = componentProps || {};

    switch (type.toUpperCase()) {
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
      default:
        return null;
    }
  }, []);

  /**
   * rule检验调整
   */
  const addRuleMessage = useCallback(
    (ruleList: Rule[], label?: string, componentType?: string) => {
      return ruleList.map((rule) => {
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

  return (
    <>
      <FormCol xs={24} sm={24}>
        <h3>刀具参数</h3>
      </FormCol>
      {body.map((item) => {
        const {
          label,
          dataIndex,
          formItemProps,
          component,
          formItemColProps,
        } = item;
        const rules = addRuleMessage(
          formItemProps?.rules || [],
          label,
          component.type
        );
        let newFormItemProps;
        if (dataIndex) {
          newFormItemProps = {
            ...formItemProps,
            name: dataIndex,
            rules,
          };
        } else {
          newFormItemProps = {
            ...formItemProps,
            rules,
          };
        }
        return (
          <FormCol key={item.label} {...formItemColProps}>
            <FormItem label={label} {...newFormItemProps}>
              {renderComponent(component)}
            </FormItem>
          </FormCol>
        );
      })}
    </>
  );
};

export default FormBody;

interface Props {
  body: FormItemConfig[];
}
