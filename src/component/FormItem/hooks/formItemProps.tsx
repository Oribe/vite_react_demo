import { Rule } from "antd/lib/form";
import { isFunction } from "lodash-es";
import { useCallback, useMemo } from "react";
import {
  ComponentFunc,
  FormItem as FormItemConfig,
  FormItemProps,
  isComponentFuncConfig,
} from "store/modules/form";
import {
  formItemNormalize,
  reCreateFunc,
  switchTypeToMessage,
} from "utils/index";

const useFormItemProps = (param: Param) => {
  const {
    label,
    type,
    dataIndex,
    formItemProps: { func, ...formItemProps } = {},
  } = param;
  /**
   * rule检验调整
   */
  const resetRuleMessage = useCallback(
    (ruleList: Rule[], lab?: string, componentType?: string) => {
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
          if (componentType === "select") {
            return { ...rule, message: `请选择${lab}` };
          }
          return { ...rule, message: `请输入${lab}` };
        }
        return rule;
      });
    },
    []
  );

  /**
   * 重组formItemProps
   */
  const reCreateRuleToFormItemProps = useCallback<FormItemPropsWithNewRule>(
    (rules: Rule[]) => {
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
      }
      if (dataIndex) {
        return {
          ...formItemProps,
          name: dataIndex,
          rules,
        };
      }
      return {
        ...formItemProps,
        name: dataIndex,
        rules,
      };
    },
    [dataIndex, formItemProps, type]
  );

  /**
   * 尝试调整组件配置属性
   */
  const assembleFormItemProps = useMemo(() => {
    const { rules } = formItemProps;
    /**
     * 将检验规则信息补全完整
     */
    const newRules = resetRuleMessage(rules || [], label, type);
    const formItemPropsWithNewRule = reCreateRuleToFormItemProps(newRules);
    let newFuncs: ComponentFunc = {};
    if (isComponentFuncConfig(func)) {
      newFuncs = reCreateFunc(func, formItemNormalize);
    }
    return { ...formItemPropsWithNewRule, ...newFuncs };
  }, [
    formItemProps,
    func,
    label,
    reCreateRuleToFormItemProps,
    resetRuleMessage,
    type,
  ]);

  return [assembleFormItemProps];
};

export default useFormItemProps;

type Param = {
  label?: string;
  dataIndex?: string;
  type?: FormItemConfig["component"]["type"];
  formItemProps?: FormItemProps;
};

type FormItemPropsWithNewRule = (
  rules: Rule[]
) => {
  name?: string;
} & FormItemProps;
