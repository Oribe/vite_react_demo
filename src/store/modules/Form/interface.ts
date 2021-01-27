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
}
