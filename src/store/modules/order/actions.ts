import { createAsyncThunk } from "@reduxjs/toolkit";
import { createActinos } from "utils/index";
import { orderApi } from "utils/api";
import { Cutter } from "./interface";
import { RootReducer } from "store/store";
import { FormMenu } from "../Form";

/**
 * actionTypes
 */
const PREFIX_ACTION_TYPES = "order";
export const ACTION_TYPES = {
  SEARCH_ORDER_NUMBER: "SEARCH_ORDER_NUMBER",
  ORDER_COLLECTION: "ORDER_COLLECTION",
  ADD_ORDER_LIST: "ADD_ORDER_LIST",
};

interface SearchOrderNumberQuery {
  orderNumber: string;
  subCategory: number;
}
/**
 * 订货号搜索
 */
export const searchOrderNumber = createAsyncThunk(
  createActinos(ACTION_TYPES.SEARCH_ORDER_NUMBER, PREFIX_ACTION_TYPES).type,
  async ({ orderNumber, subCategory }: SearchOrderNumberQuery) => {
    console.log(orderNumber, subCategory);
    const response = await orderApi.searchOrderNumber({
      orderNumber: orderNumber.toUpperCase(),
      subCategory,
    });
    return response;
  }
);

/**
 * 添加收藏
 */
export const collection = createAsyncThunk(
  createActinos(ACTION_TYPES.ORDER_COLLECTION, PREFIX_ACTION_TYPES).type,
  async (cutter: Cutter) => {
    const result = await orderApi.collection(cutter);
    return result;
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
 * 添加到订单列表
 */
export const addToOrderList = createAsyncThunk(
  createActinos(ACTION_TYPES.ADD_ORDER_LIST, PREFIX_ACTION_TYPES).type,
  async (order: Cutter, { getState }) => {
    const {
      form: { menu },
      user: {
        userInfo: { id },
      },
    } = getState() as RootReducer;
    const category = getCategoryWithSub(menu, order.subCategory);
    if (category) {
      order.category = category;
    } else {
      return Promise.reject("刀具大类不存在");
    }
    order.submitter = id;
    return order;
  }
);
