import { createAsyncThunk, isRejected } from "@reduxjs/toolkit";
import { message } from "antd";
import { RootReducer } from "store/store";
import { cutterApi, orderApi } from "utils/api";
import { createActions } from "utils/index";
import { FormMenu } from "../form";
import { Cutter } from "./interface";

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
  const newCutter = cutter;
  const {
    form: {
      menu: { data },
    },
  } = getState() as RootReducer;
  const category = getCategoryWithSub(data, newCutter.subCategory);
  if (category) {
    newCutter.category = category;
  } else {
    return Promise.reject(new Error("刀具大类不存在"));
  }
  return Promise.resolve(newCutter);
};

/**
 * 添加到订单列表
 */
export const addToOrderList = createAsyncThunk<Cutter, Cutter>(
  createActions(ACTION_TYPES.ADD_ORDER_LIST, ACTION_PREFIX_ORDER).type,
  async (order, { getState }) => {
    const newOrder = await processCutter(order, getState);
    await cutterApi.save(newOrder);
    return newOrder;
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
    const promiseResults = [];
    while (i < cutterList.length) {
      promiseResults.push(dispatch(addToOrderList(cutterList[i])));
      i += 1;
    }
    await Promise.all(promiseResults);
    let { length } = promiseResults;
    while (length) {
      length -= 1;
      const result = promiseResults[length];
      if (isRejected(result)) {
        // 添加失败删除之前添加的
        dispatch({
          type: "order/deletedOrderAction",
          payload: cutterList.map((item) => item.orderNumber),
        });
        return Promise.reject();
      }
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
    const newCutterList: (Cutter | Promise<Cutter>)[] = [];
    for (let i = 0; i < cutterList.length; i += 1) {
      if (cutterList[i].category) {
        newCutterList.push(cutterList[i]);
      } else {
        newCutterList.push(processCutter(cutterList[i], getState));
      }
    }
    try {
      await Promise.all(newCutterList);
    } catch (e) {
      message.error("收藏失败");
      return;
    }
    cutterApi
      .collection(newCutterList)
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
