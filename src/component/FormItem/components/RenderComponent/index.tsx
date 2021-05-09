import { AutoComplete, Input, InputNumber, Select } from "antd";
import Complex from "component/Complex";
import ImgSelect from "component/ImgSelect";
import { debounce, isFunction } from "lodash";
import React, {
  ChangeEvent,
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Component,
  FormItem as FormItemConfig,
  isImageOptions,
  isOptions,
  SelectProps,
} from "store/modules/form";
import { produce } from "immer";
import { SelectValue } from "antd/lib/select";
import initialOptions from "./model";

interface Props {
  comp?: Component;
  other?: Options;
  value?: undefined;
  onChange?: (value?: unknown) => void;
  onDisableChange?: (disable: boolean) => void;
}

interface Options {
  complexConfig?: FormItemConfig[];
  associatedValues?: (string | number)[];
}

type CompInputType = ChangeEvent<HTMLInputElement> | SelectValue;

const SwitchComponent: FC<Props> = memo(
  ({ comp, other = {}, value, onChange, onDisableChange }) => {
    const { type, props: componentProps, func } = comp || {};
    const { options, disable, readOnly } = componentProps || {};
    const [opts, setOpts] = useState<SelectProps | undefined>(options);
    const [funcs, setFuncs] = useState(func);

    const { complexConfig, associatedValues } = other;
    /**
     * 筛选出级联组件对象的下拉菜单
     */
    useEffect(() => {
      if (associatedValues && associatedValues.length > 0) {
        setOpts(initialOptions(options, associatedValues, true));
      }
    }, [associatedValues, options]);

    /**
     * 重新调整autoCompleted的onsearch方法
     */
    useEffect(() => {
      if (func && func.onSearch && isFunction(func.onSearch)) {
        const { onSearch } = func;
        const handleOnSearch = debounce(async (v: string) => {
          const response = (await onSearch(v)) as undefined;
          // console.log("response", response);
          setOpts(response);
        }, 1000);
        setFuncs(
          produce(func, (draft) => {
            Reflect.set(draft, "onSearch", handleOnSearch);
            return draft;
          })
        );
      }
    }, [func]);

    const handleValueChange = useCallback(
      (v: CompInputType) => {
        if (onChange) {
          if (typeof v === "number" || typeof v === "string") {
            onChange(v);
            return;
          }
          if (v && "value" in v) {
            onChange(v.value);
            return;
          }
          if (Array.isArray(v)) {
            onChange(v);
            return;
          }
          onChange(v && v.target.value);
        }
      },
      [onChange]
    );

    /**
     * 返回组件状态
     */
    const componentStatus = useCallback(
      (statusType?: boolean | (string | number)[]) => {
        if (associatedValues) {
          if (Array.isArray(statusType)) {
            return statusType.some((item) => {
              if (typeof item === "number") {
                return associatedValues.includes(item);
              }
              if (item.includes("!")) {
                if (item.includes("+")) {
                  const val = +item.replace("!+", "");
                  return !associatedValues.includes(val);
                }
                // 字符串
                return !associatedValues.includes(item.replace("!", ""));
              }
              return associatedValues.includes(item);
            });
          }
          return !!statusType;
        }
        return false;
      },
      [associatedValues]
    );

    useEffect(() => {
      if (onDisableChange) {
        onDisableChange(componentStatus(disable));
      }
    }, [componentStatus, disable, onDisableChange]);

    /**
     * 筛选出对应的组件
     */
    const switchComponent = useMemo(() => {
      switch (type?.toUpperCase()) {
        /**
         * 输入框
         */
        case "input".toUpperCase():
          return (
            <Input
              value={value}
              {...componentProps}
              {...funcs}
              disabled={componentStatus(disable)}
              readOnly={componentStatus(readOnly)}
              onChange={handleValueChange}
            />
          );
        case "inputNumber".toUpperCase():
          return (
            <InputNumber
              style={{ width: "100%" }}
              value={value}
              {...componentProps}
              {...funcs}
              disabled={componentStatus(disable)}
              readOnly={componentStatus(readOnly)}
              onChange={handleValueChange}
            />
          );
        /**
         * 下拉框
         */
        case "select".toUpperCase():
          return (
            <Select
              value={value}
              {...componentProps}
              options={opts && isOptions(opts) ? opts : []}
              dropdownMatchSelectWidth={false}
              {...funcs}
              disabled={componentStatus(disable)}
              onChange={handleValueChange}
            />
          );
        /**
         * 图片选择
         */
        case "imgSelect".toUpperCase():
          if (options && isImageOptions(options)) {
            return <ImgSelect options={options} />;
          }
          return null;
        /**
         * 复合组件
         */
        case "complex".toLocaleUpperCase():
          return <Complex config={complexConfig} />;
        /**
         * 自动完成
         */
        case "autoComplete".toLocaleUpperCase():
          return (
            <AutoComplete
              value={value}
              {...componentProps}
              options={opts && isOptions(opts) ? opts : []}
              {...funcs}
              disabled={componentStatus(disable)}
              onChange={handleValueChange}
            />
          );
        /**
         * 默认
         */
        default:
          return (
            <Input
              value={value}
              {...componentProps}
              {...funcs}
              readOnly={componentStatus(readOnly)}
              disabled={componentStatus(disable)}
            />
          );
      }
    }, [
      complexConfig,
      componentProps,
      componentStatus,
      disable,
      funcs,
      handleValueChange,
      options,
      opts,
      readOnly,
      type,
      value,
    ]);

    return switchComponent;
  }
);

export default SwitchComponent;
