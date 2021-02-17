/**
 * 表单内容
 */

import { Rule } from "antd/lib/form";
import { isFunction } from "lodash-es";
import React, { FC, useCallback } from "react";
import { FormItem as FormItemConfig } from "store/modules/Form";
import { switchTypeToMessage } from "utils/index";
import FormCol from "../FormCol";
import FormItem from "../FormItem";

const FormBody: FC<Props> = (props) => {
  const { body } = props;

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
          complexConfig,
        } = item;
        /**
         * 将检验规则信息补全完整
         */
        const rules = addRuleMessage(
          formItemProps?.rules || [],
          label,
          component.type
        );
        /**
         * 重新组合新的传递参数
         */
        let newFormItemProps;
        if (dataIndex && component.type !== "complex") {
          /**
           * 如果组件类型不等于复合组件
           * 删除name字段
           */
          newFormItemProps = {
            ...formItemProps,
            // name: dataIndex,
            rules,
          };
        } else if (dataIndex) {
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
            <FormItem
              label={label}
              component={component}
              complexConfig={complexConfig}
              {...newFormItemProps}
            />
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
