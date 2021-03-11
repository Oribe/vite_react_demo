import { createSelector } from "@reduxjs/toolkit";
import { CascaderOptionType } from "antd/lib/cascader";
import { RootReducer } from "store/index";
import { CollectionState } from "store/modules/collection";
import { FormMenu, FormState, FormSubMenu } from "store/modules/form";

function menuToCasOption(menu: FormMenu[]) {
  const options = (list: (FormMenu | FormSubMenu)[]) =>
    list.reduce<CascaderOptionType[]>((o, c) => {
      const { name, category, subCategory } = c;
      const item: CascaderOptionType = {
        label: name,
        value: Array.isArray(subCategory) ? category : subCategory,
      };
      if (subCategory && Array.isArray(subCategory)) {
        const children = options(subCategory);
        item.children = children;
      }
      o.push(item);
      return o;
    }, []);
  return options(menu);
}

export const collectionStore = createSelector<
  RootReducer,
  CollectionState,
  FormState,
  StateProps
>(
  (store) => store.collection,
  (store) => store.form,
  (orderState, formState) => ({
    ...orderState,
    cutterCategory: menuToCasOption(formState.menu.data),
  })
);

interface StateProps extends CollectionState {
  cutterCategory: CascaderOptionType[];
}
