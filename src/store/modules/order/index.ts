import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Key } from "react";
import { createActions } from "utils/index";
import {
  ACTION_TYPES,
  addListToOrderList,
  addToOrderList,
  deleteUncompletedOrders,
  getHistoryOrder,
  getHistoryOrderDetail,
  getUncompletedOrders,
  orderListSubmit,
  saveUncompletedOrders,
} from "./actions";
import { Cutter } from "./interface";
import orderState, { ORDER_LIST_CACHE } from "./state";

const orderSlice = createSlice({
  name: "order",
  initialState: orderState,
  reducers: {
    [createActions(ACTION_TYPES.UNCOMPLETED_TABLE_STATUS).type](state, action) {
      const { uncompleted } = state;
      uncompleted.loading = action.payload;
    },
    [createActions(ACTION_TYPES.ORDER_TABLE_STATUS).type](state, action) {
      return {
        ...state,
        orderListLoading: action.payload,
      };
    },
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
    /**
     * 修改数量
     * 保存
     */
    quantityChangeSave(state, action: PayloadAction<Cutter[]>) {
      const newState = state;
      newState.orderList = action.payload;
      return newState;
    },
    /**
     * 清空订单列表
     */
    clearOrderList(state) {
      const newState = state;
      newState.orderList = [];
      return newState;
    },
    /**
     * 订单列表保存到缓存
     */
    saveOrderListToCache(state) {
      const dataString = JSON.stringify(state.orderList);
      sessionStorage.setItem(ORDER_LIST_CACHE, dataString);
      return {
        ...state,
        orderList: [],
      };
    },
    /**
     * 从缓存中取出订单列表
     */
    getOrderListFromCache(state) {
      const newState = state;
      const dataString = sessionStorage.getItem(ORDER_LIST_CACHE);
      let data: Cutter[] = [];
      if (dataString) {
        data = JSON.parse(dataString);
      }
      newState.orderList = data;
      sessionStorage.removeItem(ORDER_LIST_CACHE);
      return newState;
    },
  },
  extraReducers: ({ addCase }) => {
    // 添加到订单列表中
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
    addCase(addListToOrderList.fulfilled, (state, action) => {
      const newState = state;
      newState.orderList = action.payload;
      return newState;
    });
    // 提交订单
    addCase(orderListSubmit.pending, (state) => ({
      ...state,
      orderListLoading: true,
    }))
      .addCase(orderListSubmit.fulfilled, (state) => ({
        ...state,
        orderListLoading: false,
      }))
      .addCase(orderListSubmit.rejected, (state) => ({
        ...state,
        orderListLoading: false,
      }));
    // 获取历史
    addCase(getHistoryOrder.pending, (state) => {
      const { history } = state;
      history.loading = true;
      history.data = [];
    })
      .addCase(getHistoryOrder.rejected, (state) => {
        const { history } = state;
        history.loading = false;
      })
      .addCase(getHistoryOrder.fulfilled, (state, action) => {
        const { history } = state;
        history.loading = false;
        history.data = action.payload;
      });
    // 获取为完成
    addCase(getUncompletedOrders.pending, (state) => {
      const { uncompleted } = state;
      uncompleted.loading = true;
    })
      .addCase(getUncompletedOrders.rejected, (state) => {
        const { uncompleted } = state;
        uncompleted.loading = false;
        uncompleted.data = [];
      })
      .addCase(getUncompletedOrders.fulfilled, (state, action) => {
        const { uncompleted } = state;
        uncompleted.loading = false;
        uncompleted.data = action.payload;
      });
    // 保存为未完成订单
    addCase(saveUncompletedOrders.pending, (state) => ({
      ...state,
      orderListLoading: true,
    }))
      .addCase(saveUncompletedOrders.fulfilled, (state) => ({
        ...state,
        orderListLoading: false,
        orderList: [],
      }))
      .addCase(saveUncompletedOrders.rejected, (state) => ({
        ...state,
        orderListLoading: false,
      }));
    // 删除暂存订单
    addCase(deleteUncompletedOrders.pending, (state) => {
      const { uncompleted } = state;
      uncompleted.loading = true;
    })
      .addCase(deleteUncompletedOrders.rejected, (state) => {
        const { uncompleted } = state;
        uncompleted.loading = false;
      })
      .addCase(deleteUncompletedOrders.fulfilled, (state) => {
        const { uncompleted } = state;
        uncompleted.loading = true;
      });
    addCase(getHistoryOrderDetail.fulfilled, (state, action) => {
      return {
        ...state,
        orderList: action.payload,
        orderListLoading: false,
      };
    });
  },
});

export * from "./actions";
export * from "./interface";
export const order = orderSlice.reducer;
export const {
  deletedOrderAction,
  quantityChangeSave,
  clearOrderList,
  getOrderListFromCache,
  saveOrderListToCache,
} = orderSlice.actions;
