import { createSelector } from "reselect";
import { FormMenu, FormState } from "store/modules/form";
import { OrderState } from "store/modules/order";
import { RootReducer } from "store/store";

const orderDetailState = createSelector<
  RootReducer,
  OrderState,
  FormState,
  OrderDetailState
>(
  (store) => store.order,
  (store) => store.form,
  (order, form) => ({
    cutters: form.menu.data,
  })
);

export default orderDetailState;

interface OrderDetailState {
  cutters: FormMenu[];
}
