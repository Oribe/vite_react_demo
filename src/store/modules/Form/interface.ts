import { ColProps as AColProps } from "antd";
import { Components } from "antd/lib/date-picker/generatePicker";
import { Rule } from "antd/lib/form";
import { isObject } from "lodash-es";
import { CSSProperties } from "react";
import { NavRouter } from "route/index";

/**
 * 侧边栏 start
 */
export interface FormMenu {
  category: number;
  name: string;
  imgUrl: string;
  subCategory: FormSubMenu[];
}

export interface FormSubMenu {
  category: number;
  name: string;
  imgUrl: string;
  subCategory: number;
}
/* 侧边栏 end */

/**
 * 表单配置 start
 */
export interface FormConfig {
  title: string;
  caption: FormItem[];
  body: FormItem[];
  others?: OtherConfig;
}

export interface FormItem {
  label?: string;
  dataIndex?: string;
  associatedDataIndex?: string[];
  hintImgUrl?: string;
  formItemProps?: FormItemProps;
  formItemColProps?: ColProps;
  component: Component;
  complexConfig?: FormItem[];
}

export interface Component {
  type: string;
  props?: {
    options?: SelectProps;
  };
  func?: ComponentFunc | ComponentFuncConfig;
}

export interface FormItemProps {
  rules?: Rule[];
  style?: CSSProperties;
  noStyle?: boolean;
  func?: ComponentFunc | ComponentFuncConfig;
}

export type ComponentFuncConfig = Record<string, string | boolean>;
export type ComponentFunc = Record<string, (...arg: unknown[]) => void>;

/**
 * 类型保护
 */
export function isComponentFuncConfig(
  param?: Component["func"]
): param is ComponentFuncConfig {
  if (!param || !isObject(param)) return false;
  return Object.keys(param).some((key) => {
    if (typeof param[key] === "string" || typeof param[key] === "boolean") {
      return true;
    }
    return false;
  });
}

export interface OtherConfig {
  matchCutter?: number;
}

/**
 * 单独写一个
 * 因为直接引用第三方类型typescript无法检验通过
 */
export interface ColProps {
  flex?: AColProps["flex"];
  span?: AColProps["span"];
  order?: AColProps["order"];
  offset?: AColProps["offset"];
  push?: AColProps["push"];
  pull?: AColProps["pull"];
  xs?: AColProps["xs"];
  sm?: AColProps["sm"];
  md?: AColProps["md"];
  lg?: AColProps["lg"];
  xl?: AColProps["xl"];
  xxl?: AColProps["xxl"];
  prefixCls?: AColProps["prefixCls"];
}
/* 表单配置 end */

export interface Options {
  label: string | number;
  value: string | number;
}

export interface ImageOptions {
  label: string;
  dataIndex: string;
  src: string;
}

export type MapOptions = Map<string, (string | number)[] | MapOptions>;

export type SelectProps = Options[] | ImageOptions[] | MapOptions;

/**
 * state类型结构
 */
export interface FormState {
  menu: Array<NavRouter>;
  form: {
    [key: number]: FormConfig | undefined;
  };
  manufacturer: Options[];
}

/**
 * 类型判断
 * 返回图片选项
 */
export function isImageOptions(option: SelectProps): option is ImageOptions[] {
  return (
    (option as ImageOptions[])[0] &&
    (option as ImageOptions[])[0].src !== undefined
  );
}

/**
 *  类型判断
 *  Options
 */
export function isOptions(options: SelectProps): options is Options[] {
  if (isImageOptions(options)) {
    return false;
  }
  if ((options as Options[])?.[0]?.label) {
    return true;
  }
  return false;
}
