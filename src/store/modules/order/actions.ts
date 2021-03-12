import { createAsyncThunk, isRejected } from "@reduxjs/toolkit";
import { message } from "antd";
import { RootReducer } from "store/store";
import { cutterApi, orderApi } from "utils/api";
import { createActions } from "utils/index";
import { FormMenu } from "../form";
import { Cutter, SubmitOrderType } from "./interface";

/**
 * actionTypes
 */
export const ACTION_PREFIX_ORDER = "order";
export const ACTION_TYPES = {
  SEARCH_ORDER_NUMBER: "SEARCH_ORDER_NUMBER",
  ORDER_COLLECTION: "ORDER_COLLECTION",
  ADD_ORDER_LIST: "ADD_ORDER_LIST",
  ADD_LIST_TO_ORDER_LIST: "ADD_LIST_TO_ORDER_LIST",
  ORDER_LIST_SUBMIT: "ORDER_LIST_SUBMIT",
};

interface SearchOrderNumberQuery {
  orderNumber: string;
  subCategory: number;
}
/**
 * 刀具订货号搜索
 */
export const searchOrderNumber = createAsyncThunk(
  createActions(ACTION_TYPES.SEARCH_ORDER_NUMBER, ACTION_PREFIX_ORDER).type,
  async ({ orderNumber, subCategory }: SearchOrderNumberQuery) => {
    const response = orderApi.searchOrderNumber<Cutter[]>({
      orderNumber: orderNumber.toUpperCase(),
      subCategory,
    });
    return response;
  }
);

/**
 * 根据subCategory获取category
 */
export const getCategoryWithSub = (menu: FormMenu[], subCategory: number) => {
  const categoryObj = menu.find((subMenu) => {
    if (subMenu.subCategory && typeof Array.isArray(subMenu.subCategory)) {
      const { subCategory: children } = subMenu;
      return children.find(
        (child) => Number(child.subCategory) === subCategory
      );
    }
    return false;
  });
  return categoryObj?.category;
};

/**
 * 添加大类
 */
export const processCutter = (cutter: Cutter, getState: () => unknown) => {
  const {
    form: {
      menu: { data },
    },
  } = getState() as RootReducer;
  const category = getCategoryWithSub(data, cutter.subCategory);
  if (category) {
    cutter.category = category;
  } else {
    return Promise.reject("刀具大类不存在");
  }
  return Promise.resolve(cutter);
};

/**
 * 添加到订单列表
 */
export const addToOrderList = createAsyncThunk<Cutter, Cutter>(
  createActions(ACTION_TYPES.ADD_ORDER_LIST, ACTION_PREFIX_ORDER).type,
  async (order, { getState }) => {
    const _order = await processCutter(order, getState);
    await cutterApi.save(_order);
    return _order;
  }
);

/**
 * 添加到订单列表
 * 多条
 */
export const addListToOrderList = createAsyncThunk<unknown, Cutter[]>(
  createActions(ACTION_TYPES.ADD_LIST_TO_ORDER_LIST, ACTION_PREFIX_ORDER).type,
  async (cutterList, { dispatch }) => {
    let i = 0;
    while (i < cutterList.length) {
      const result = await dispatch(addToOrderList(cutterList[i]));
      if (isRejected(result)) {
        // 添加失败删除之前添加的
        dispatch({
          type: "order/deletedOrderAction",
          payload: cutterList.slice(0, i).map((item) => item.orderNumber),
        });
        return Promise.reject();
      }
      i++;
    }
    return Promise.resolve();
  }
);

/**
 * 添加收藏
 */
export const collection = createAsyncThunk<void, Cutter[]>(
  createActions(ACTION_TYPES.ORDER_COLLECTION, ACTION_PREFIX_ORDER).type,
  async (cutterList: Cutter[], { getState }) => {
    const _cutterList: Cutter[] = [];
    for (let i = 0; i < cutterList.length; i++) {
      if (cutterList[i].category) {
        _cutterList.push(cutterList[i]);
        continue;
      }
      const cutter = await processCutter(cutterList[i], getState);
      _cutterList.push(cutter);
    }
    console.log(_cutterList);

    cutterApi
      .collection(_cutterList)
      .then(() => {
        message.success("收藏成功");
      })
      .catch((error) => {
        console.log(error);
        message.error(error?.message ?? "收藏失败");
      });
  }
);

/**
 * 提交
 */
// export const orderListSubmit = createAsyncThunk<unknown, Cutter[]>(
//   createActions(ACTION_TYPES.ORDER_LIST_SUBMIT).type,
//   async (orderList, { dispatch, getState }) => {

//   }
// );
