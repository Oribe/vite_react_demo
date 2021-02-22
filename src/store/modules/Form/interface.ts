import { ColProps } from "antd";
import { Rule } from "antd/lib/form";
import { CSSProperties } from "react";
import { NavRouter } from "route/index";

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

export interface FormConfig {
  title: string;
  caption: FormItem[];
  body: FormItem[];
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
}

export interface FormItemProps {
  rules?: Rule[];
  style?: CSSProperties;
  noStyle?: boolean;
}

export interface Cutter {
  orderNumber: string;
  category: number;
  subCategory: number;
  [key: string]: unknown;
}

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

export interface FormState {
  menu: Array<NavRouter>;
  form: {
    [key: number]: FormConfig | undefined;
  };
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
