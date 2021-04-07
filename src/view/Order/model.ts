import { ButtonGroupProps } from "antd/lib/button";
import { ColumnType } from "antd/lib/table";
import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
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

type OrderStateProps = {
  orderList: OrderState["orderList"];
  orderListStatus: boolean;
  cutterCategory: FormMenu[];
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
    orderList: order.orderList,
    orderListStatus: order.orderListLoading,
    cutterCategory: form.menu.data,
  })
);
