/**
 * 向formItemProps添加name属性
 */

import { useMemo } from "react";
import { FormItem as FormItemConfig, FormItemProps } from "store/modules/form";

const useRules = (
  dataIndex?: string,
  type?: FormItemConfig["component"]["type"],
  formItemProps?: FormItemProps
) => {
  /**
   * 重组formItemProps
   */
  const itemProps = useMemo<FormItemPropsWithNewRule>(() => {
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
      };
    }
    if (dataIndex) {
      return {
        ...formItemProps,
        name: dataIndex,
      };
    }
    return {
      ...formItemProps,
      name: dataIndex,
    };
  }, [dataIndex, formItemProps, type]);

  return itemProps;
};

export default useRules;

type FormItemPropsWithNewRule = {
  name?: string;
} & FormItemProps;
