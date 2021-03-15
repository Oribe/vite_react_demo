import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Key } from "react";
import { addToOrderList } from "./actions";
import orderState from "./state";

const orderSlice = createSlice({
  name: "order",
  initialState: orderState,
  reducers: {
    deletedOrderAction(state, action: PayloadAction<Key[]>) {
      const orderNumberList = action.payload;
      if (!orderNumberList) {
        return state;
      }
      let len = orderNumberList.length;
      while (len) {
        len -= 1;
        const orderNumber = orderNumberList[len];
        const index = state.orderList.findIndex(
          (item) => item.orderNumber === orderNumber
        );
        state.orderList.splice(index, 1);
      }
      return state;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(addToOrderList.fulfilled, (state, action) => {
      const newState = state;
      if (action.payload) {
        const { category, orderNumber, subCategory } = action.payload;
        const index = newState.orderList.findIndex((order) => {
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
          newState.orderList[index] = action.payload;
        } else {
          newState.orderList.push(action?.payload);
        }
      }
      return newState;
    });
  },
});

export * from "./actions";
export * from "./interface";
export const order = orderSlice.reducer;
export const { deletedOrderAction } = orderSlice.actions;
