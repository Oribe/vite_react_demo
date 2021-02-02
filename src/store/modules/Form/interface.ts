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

export interface FormState {
  menu: Array<NavRouter>;
  // menu: any[];
  form: {
    [key: number]: FormConfig | undefined;
  };
}

export interface FormConfig {
  title: string;
  body: FormItem[];
}

export interface FormItem {
  label?: string;
  dataIndex?: string;
  hintImgUrl?: string;
  formItemProps?: {
    rules?: Rule[];
    style?: CSSProperties;
    noStyle?: boolean;
  };
}
