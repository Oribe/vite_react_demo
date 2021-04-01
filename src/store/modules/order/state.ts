import { OrderState } from "./interface";

const orderState: OrderState = {
  orderListLoading: false,
  orderList: [],
  history: {
    loading: false,
    data: [],
  },
  uncompleted: {
    loading: false,
    data: [],
  },
};

export default orderState;

export const ORDER_LIST_CACHE = "order_list_cache";
