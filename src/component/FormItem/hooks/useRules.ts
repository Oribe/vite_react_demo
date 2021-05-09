/**
 * 补全rules
 */

import { isFunction } from "lodash-es";
import { useMemo } from "react";
import { FormItem as FormItemConfig, FormItemProps } from "store/modules/form";
import { switchTypeToMessage } from "utils/index";

const useRules = (
  label?: string,
  type?: FormItemConfig["component"]["type"],
  formItemProps?: FormItemProps
) => {
  const { rules: ruleList = [], ...otherFormItemProps } = formItemProps || {};

  /**
   * rule检验调整
   */
  const rules = useMemo(() => {
    return ruleList.map((rule) => {
      if (isFunction(rule)) {
        /**
         * 如果当前规则为函数
         * 则直接返回这个函数
         */
        return rule;
      }
      const { type: t, message } = rule;
      if (message) {
        // 如果存在消息提示
        return rule;
      }
      if (t) {
        /**
         * 如果存在类型
         */
        return { ...rule, message: switchTypeToMessage(t) };
      }
      if ("required" in rule) {
        if (type === "select") {
          return { ...rule, message: `请选择${label}` };
        }
        return { ...rule, message: `请输入${label}` };
      }
      return rule;
    });
  }, [label, ruleList, type]);

  return { ...otherFormItemProps, rules };
};

export default useRules;
