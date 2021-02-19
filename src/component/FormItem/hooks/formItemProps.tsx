import { FormItemProps, Rule } from "antd/lib/form";
import { isFunction } from "lodash-es";
import { useCallback, useMemo } from "react";
import { FormItem as FormItemConfig } from "store/modules/Form";
import { switchTypeToMessage } from "utils/index";

const useFormItemProps = (param: Param) => {
  const { label, type, dataIndex, formItemProps } = param;

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

  /**
   * 尝试调整组件配置属性
   */
  const assembleFormItemProps = useMemo(() => {
    /**
     * 将检验规则信息补全完整
     */
    const rules = addRuleMessage(formItemProps?.rules || [], label, type);
    /**
     * 重新组合新的传递参数
     */
    if (!dataIndex || type === "complex" || type === "imgSelect") {
      /**
       * 如果组件类型不等于复合组件
       * 删除name字段
       */
      return {
        ...formItemProps,
        rules,
      };
    } else if (dataIndex) {
      return {
        ...formItemProps,
        name: dataIndex,
        rules,
      };
    } else {
      return {
        ...formItemProps,
        name: dataIndex,
        rules,
      };
    }
  }, [addRuleMessage, dataIndex, formItemProps, label, type]);

  return [assembleFormItemProps];
};

export default useFormItemProps;

type Param = {
  label?: string;
  dataIndex?: string;
  type?: FormItemConfig["component"]["type"];
  formItemProps?: FormItemProps;
};
