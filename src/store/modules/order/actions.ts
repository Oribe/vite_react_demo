// import { CaseReducer } from "@reduxjs/toolkit";
// import { Act } from "store/type";
// import { Cutter, OrderState } from "./interface";

// export const addToOrderList: CaseReducer<OrderState, Act<Cutter>> = (
//   state,
//   action
// ) => {
//   if (action.payload) {
//     const { category, orderNumber, subCategory } = action.payload;
//     const index = state.orderList.findIndex((order) => {
//       if (
//         order.category === category &&
//         order.orderNumber === orderNumber &&
//         order.subCategory === subCategory
//       ) {
//         return true;
//       }
//       return false;
//     });
//     if (index > -1) {
//       // 存在， 覆盖
//       state.orderList[index] = action.payload;
//     } else {
//       state.orderList.push(action?.payload);
//     }
//   }
//   return state;
// };