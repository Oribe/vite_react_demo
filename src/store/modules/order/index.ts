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
      while (len--) {
        const orderNumber = orderNumberList[len];
        const index = state.orderList.findIndex(
          (item) => item.orderNumber === orderNumber
        );
        state.orderList.splice(index, 1);
      }
      console.log("1111");
      return state;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(addToOrderList.fulfilled, (state, action) => {
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
    });
  },
});

export * from "./actions";
export * from "./interface";
export const order = orderSlice.reducer;
export const { deletedOrderAction } = orderSlice.actions;
