import { createSelector } from "reselect";
import { OrderState } from "store/modules/order";
import { RootReducer } from "store/store";

const uncompletedState = createSelector<
  RootReducer,
  OrderState,
  OrderState["uncompleted"]
>(
  (store) => store.order,
  (order) => order.uncompleted
);

export default uncompletedState;
