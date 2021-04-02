import { createSelector } from "@reduxjs/toolkit";
import { RootReducer } from "store/index";
import { FormState } from "store/modules/form";
import { OrderState } from "store/modules/order";

export const formProps = createSelector<RootReducer, FormState, FormState>(
  (states) => states.form,
  (formState) => formState
);

export const orderProps = createSelector<RootReducer, OrderState, OrderState>(
  (states) => states.order,
  (orderState) => orderState
);
