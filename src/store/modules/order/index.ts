import { createSlice } from "@reduxjs/toolkit";
import { Act } from "store/type";
import { Cutter } from "./interface";
import orderState from "./state";

const orderSlice = createSlice({
  name: "order",
  initialState: orderState,
  reducers: {
    addToOrderList(state, action: Act<Cutter>) {
      if (action.payload) {
        const { category, orderNumber, subCategory } = action.payload;
        const index = state.orderList.findIndex((order) => {
          if (
            order.category === category &&
            order.orderNumber === orderNumber &&
            order.subCategory === subCategory
          ) {
            return true;
          }
          return false;
        });
        if (index > -1) {
          // 存在， 覆盖
          state.orderList[index] = action.payload;
        } else {
          state.orderList.push(action?.payload);
        }
      }
    },
  },
  extraReducers: {},
});

export * from "./interface";
export const order = orderSlice.reducer;
export const { addToOrderList } = orderSlice.actions;
