import { createSelector } from "reselect";
import { OrderState } from "store/modules/order";
import { RootReducer } from "store/store";

const historyStore = createSelector<
  RootReducer,
  OrderState,
  OrderState["history"]
>(
  (state) => state.order,
  (order) => order.history
);

export default historyStore;
