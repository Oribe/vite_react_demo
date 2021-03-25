import { AutoComplete, Input, Select } from "antd";
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
import initialOptions from "./initialOptions";

interface Props {
  comp?: Component;
  other?: Options;
  value?: undefined;
  onChange?: (value?: unknown) => void;
}

type CompInputType = ChangeEvent<HTMLInputElement> | SelectValue;

/**
 * 函数组件
 */
const RenderComponent: FC<Props> = ({
  comp,
  other: { complexConfig, associatedValues } = {},
  value,
  onChange,
}) => {
  const { type, props: componentProps, func } = comp || {};
  const { options } = componentProps || {};
  const [opts, setOpts] = useState<SelectProps | undefined>(options);
  const [funcs, setFuncs] = useState(func);

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
      const handleOnSearch = async (v: string) => {
        const response = (await onSearch(v)) as undefined;
        // console.log("response", response);
        setOpts(response);
      };
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
        if ("value" in v) {
          onChange(v.value);
          return;
        }
        if (Array.isArray(v)) {
          onChange(v);
          return;
        }
        onChange(v.target.value);
      }
    },
    [onChange]
  );

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
            onChange={handleValueChange}
          />
        );
      /**
       * 下拉框
       */
      case "select".toUpperCase():
        if (opts && isOptions(opts)) {
          return (
            <Select
              value={value}
              {...componentProps}
              options={opts}
              dropdownMatchSelectWidth={false}
              {...funcs}
              onChange={handleValueChange}
            />
          );
        }
        return (
          <Select
            value={value}
            {...componentProps}
            options={[]}
            dropdownMatchSelectWidth={false}
            {...funcs}
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
        if (opts && isOptions(opts)) {
          return (
            <AutoComplete
              value={value}
              {...componentProps}
              options={opts}
              {...funcs}
              onChange={handleValueChange}
            />
          );
        }
        return (
          <AutoComplete
            value={value}
            {...componentProps}
            options={[]}
            {...funcs}
            onChange={handleValueChange}
          />
        );
      /**
       * 默认
       */
      default:
        return <Input value={value} {...componentProps} {...funcs} />;
    }
  }, [
    complexConfig,
    componentProps,
    funcs,
    handleValueChange,
    options,
    opts,
    type,
    value,
  ]);

  return switchComponent;
};

export default memo(RenderComponent);

/**
 * 纯函数
 */
// const renderComponent = (
//   comp?: Component,
//   { complexConfig, associatedValues }: Options = {}
// ) => {
//   const { type, props: componentProps, func } = comp || {};
//   const { options } = componentProps || {};
//   let opts: SelectProps | undefined = options;

//   /**
//    * 筛选出级联组件对象的下拉菜单
//    */
//   if (associatedValues && associatedValues.length > 0) {
//     opts = initialOptions(options, associatedValues, true);
//   }

//   /**
//    * 重新调整autoCompleted的onsearch方法
//    */
//   if (func && func.onSearch && isFunction(func.onSearch)) {
//     const { onSearch } = func;
//     const handleOnSearch = async (value: string) => {
//       const response = await onSearch(value);
//       console.log("response", response);
//     };
//     Reflect.set(func, "onSearch", handleOnSearch);
//   }

//   /**
//    * 筛选出对应的组件
//    */
//   const switchComponent = () => {
//     switch (type?.toUpperCase()) {
//       /**
//        * 输入框
//        */
//       case "input".toUpperCase():
//         return <Input {...componentProps} {...func} />;
//       /**
//        * 下拉框
//        */
//       case "select".toUpperCase():
//         if (opts && isOptions(opts)) {
//           return (
//             <Select
//               {...componentProps}
//               options={opts}
//               dropdownMatchSelectWidth={false}
//               {...func}
//             />
//           );
//         }
//         return (
//           <Select
//             {...componentProps}
//             options={[]}
//             dropdownMatchSelectWidth={false}
//             {...func}
//           />
//         );
//       /**
//        * 图片选择
//        */
//       case "imgSelect".toUpperCase():
//         if (options && isImageOptions(options)) {
//           return <ImgSelect options={options} />;
//         }
//         return null;
//       /**
//        * 复合组件
//        */
//       case "complex".toLocaleUpperCase():
//         return <Complex config={complexConfig} />;
//       /**
//        * 自动完成
//        */
//       case "autoComplete".toLocaleUpperCase():
//         if (opts && isOptions(opts)) {
//           return <AutoComplete {...componentProps} options={opts} {...func} />;
//         }
//         return <AutoComplete {...componentProps} options={[]} {...func} />;
//       /**
//        * 默认
//        */
//       default:
//         return <Input {...componentProps} {...func} />;
//     }
//   };

//   return switchComponent();
// };

// export default renderComponent;

interface Options {
  complexConfig?: FormItemConfig[];
  associatedValues?: (string | number)[];
  // onSearch?: (query?: string) => void;
}
