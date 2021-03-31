import { ButtonGroupProps } from "antd/lib/button";
import { ColumnType } from "antd/lib/table";
import { createSelector } from "reselect";
import { beforeRouterEnter } from "route/guard";
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

interface OrderStateProps {
  orderList: OrderState["orderList"];
  orderListStatus: boolean;
  cutterCategory: FormMenu[];
}

/**
 * 路由进入前
 */
beforeRouterEnter((history) => {
  console.log("进入前", history);
});

export const orderStore = createSelector<
  RootReducer,
  FormState,
  OrderState,
  OrderStateProps
>(
  (store) => store.form,
  (store) => store.order,
  (form, order) => ({
    orderList: order.orderList,
    orderListStatus: order.orderListLoading,
    cutterCategory: form.menu.data,
  })
);
