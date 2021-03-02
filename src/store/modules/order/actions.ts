import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import { RootReducer } from "store/store";
import { orderApi } from "utils/api";
import { createActinos } from "utils/index";
import { FormMenu } from "../form";
import { Cutter } from "./interface";

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
 *
 */
export const processCutter = (cutter: Cutter, getState: () => unknown) => {
  const {
    form: {
      menu: { data },
    },
    user: {
      userInfo: { id, supplier },
    },
  } = getState() as RootReducer;
  const category = getCategoryWithSub(data, cutter.subCategory);
  if (category) {
    cutter.category = category;
  } else {
    return Promise.reject("刀具大类不存在");
  }
  cutter.submitter = id;
  cutter.manufacturer = supplier;
  return Promise.resolve(cutter);
};

/**
 * 添加到订单列表
 */
export const addToOrderList = createAsyncThunk<Cutter, Cutter>(
  createActinos(ACTION_TYPES.ADD_ORDER_LIST, PREFIX_ACTION_TYPES).type,
  async (order, { getState }) => {
    const _order = processCutter(order, getState);
    return _order;
  }
);

/**
 * 添加收藏
 */
export const collection = createAsyncThunk<void, Cutter>(
  createActinos(ACTION_TYPES.ORDER_COLLECTION, PREFIX_ACTION_TYPES).type,
  async (cutter: Cutter, { getState }) => {
    const _cutter = await processCutter(cutter, getState);
    orderApi
      .collection(_cutter)
      .then(() => {
        message.success("收藏成功");
      })
      .catch(() => {
        message.error("收藏失败");
      });
  }
);
