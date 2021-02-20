import { Input, Select, AutoComplete } from "antd";
import Complex from "component/Complex";
import ImgSelect from "component/ImgSelect";
import React, { useCallback, useEffect, useState } from "react";
import { FormItem as FormItemConfig, isImageOptions } from "store/modules/Form";

const useRenderComponent = (
  comp?: FormItemConfig["component"],
  complexConfig?: FormItemConfig["complexConfig"]
) => {
  const [component, setComponent] = useState<JSX.Element | null>(null);

  const switchComponent = useCallback(() => {
    const { type, props: componentProps } = comp || {};
    const { options } = componentProps || {};

    switch (type?.toUpperCase()) {
      /**
       * 输入框
       */
      case "input".toUpperCase():
        return <Input {...componentProps} />;
      /**
       * 下拉框
       */
      case "select".toUpperCase():
        if (options && !isImageOptions(options)) {
          return (
            <Select
              {...componentProps}
              options={options}
              dropdownMatchSelectWidth={false}
            />
          );
        }
        return (
          <Select
            {...componentProps}
            options={[]}
            dropdownMatchSelectWidth={false}
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
        console.log("options", options);

        if (options && !isImageOptions(options)) {
          return <AutoComplete {...componentProps} options={options} />;
        }
        return <AutoComplete {...componentProps} options={[]} />;
      /**
       * 默认
       */
      default:
        return <Input {...componentProps} />;
    }
  }, [comp, complexConfig]);

  useEffect(() => {
    const comp = switchComponent();
    setComponent(comp);
  }, [switchComponent]);

  return [component];
};

export default useRenderComponent;
