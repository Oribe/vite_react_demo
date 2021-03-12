import { ButtonGroupProps } from "antd/lib/button";
import { ColumnType } from "antd/lib/table";
import { createSelector } from "reselect";
import { RootReducer } from "store/index";
import { FormMenu, FormState } from "store/modules/form";
import { OrderState } from "store/modules/order";
import style from "./index.module.scss";

export const publicColumnsType: ColumnType<any> = {
  align: "center",
  className: style.tableColumns,
};

export const buttonConfig: ButtonGroupProps = {
  // size: "large",
  className: style.btnGroup,
};

export const orderStore = createSelector<
  RootReducer,
  FormState,
  OrderState,
  OrderStateProps
>(
  (store) => store.form,
  (store) => store.order,
  (form, order) => ({
    ...order,
    cutterCategory: form.menu.data,
  })
);

interface OrderStateProps extends OrderState {
  cutterCategory: FormMenu[];
}
