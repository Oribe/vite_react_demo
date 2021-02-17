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
  body: FormItem[];
}

export interface FormItem {
  label?: string;
  dataIndex?: string;
  hintImgUrl?: string;
  formItemProps?: FormItemProps;
  formItemColProps?: ColProps;
  component: {
    type: string;
    props?: {
      options?: SelectProps;
    };
  };
  complexConfig?: FormItem[];
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
  label: string;
  value: string | number;
}

export interface ImageOptions {
  label: string;
  dataIndex: string;
  src: string;
}

export type SelectProps = Options[] | ImageOptions[];

export interface FormState {
  menu: Array<NavRouter>;
  form: {
    [key: number]: FormConfig | undefined;
  };
}

/**
 * 类型判断
 */
export function isImageOptions(
  option: Options[] | ImageOptions[]
): option is ImageOptions[] {
  return (
    (option as ImageOptions[])[0] &&
    (option as ImageOptions[])[0].src !== undefined
  );
}
