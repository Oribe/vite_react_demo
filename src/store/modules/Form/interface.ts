import { Rule } from "antd/lib/form";
import { CSSProperties } from "react";

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
  menu: FormMenu[];
  form: {
    [key: number]: FormConfig | undefined;
  };
}

export interface FormConfig {
  body: FormItem[];
}

interface FormItem {
  label?: string;
  dataIndex?: string;
  hintImgUrl?: string;
  formItemProps?: {
    rules?: Rule[];
    style?: CSSProperties;
    noStyle?: boolean;
  };
}
