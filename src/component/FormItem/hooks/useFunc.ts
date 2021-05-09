/**
 * 补全formItemProps中的func
 */

import { useMemo } from "react";
import {
  ComponentFunc,
  FormItemProps,
  isComponentFuncConfig,
} from "store/modules/form";
import { formItemNormalize, reCreateFunc } from "utils/index";

const useFunc = ({ func, ...formItemProps }: FormItemProps = {}) => {
  /**
   * 尝试调整组件配置属性
   */
  const assembleFormItemProps = useMemo(() => {
    /**
     * 将检验规则信息补全完整
     */
    let newFuncs: ComponentFunc = {};
    if (isComponentFuncConfig(func)) {
      newFuncs = reCreateFunc(func, formItemNormalize);
    }
    return { ...formItemProps, ...newFuncs };
  }, [formItemProps, func]);

  return assembleFormItemProps;
};

export default useFunc;
