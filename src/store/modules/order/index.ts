import { createSlice } from "@reduxjs/toolkit";
import { addToOrderList } from "./actions";
import orderState from "./state";

const orderSlice = createSlice({
  name: "order",
  initialState: orderState,
  reducers: {},
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
// export const {  } = orderSlice.actions;
