import { createAsyncThunk } from "@reduxjs/toolkit";
import { message, Modal } from "antd";
import { produce } from "immer";
import { Key } from "react";
import { RootReducer } from "store/store";
import { collectionApi, cutterApi, orderApi } from "utils/api";
import { createActions } from "utils/index";
import { FormMenu } from "../form";
import { Cutter, HistoryParamType, SubmitOrderType } from "./interface";

const { confirm } = Modal;
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
  GET_HISTORY_ORDER: "GET_HISTORY_ORDER",
  HISTORY_ORDER_DETAIL: "HISTORY_ORDER_DETAIL",
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
    const response = cutterApi.search<Cutter[]>({
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
 * 收藏
 * 导入到订单列表
 * 多条
 */
export const addListToOrderList = createAsyncThunk<Cutter[], Cutter[]>(
  createActions(ACTION_TYPES.ADD_LIST_TO_ORDER_LIST, ACTION_PREFIX_ORDER).type,
  async (cutterList, { getState }) => {
    const willAddLen = cutterList.length;
    const { orderList } = (getState() as RootReducer).order;
    const hadLenght = orderList.length;
    if (willAddLen + hadLenght > 8) {
      return Promise.reject(new Error("刀具数量不能超过8条"));
    }
    /**
     * 用于存放重复刀具信息
     * key: orderList中对应的脚标
     * value: cutterList中对应的脚标
     */
    const repeatMap = new Map<number, number>();
    for (let i = 0; i < willAddLen; i += 1) {
      const { category, subCategory, orderNumber } = cutterList[i];
      const index = orderList.findIndex(
        (item) =>
          item.category === category &&
          item.subCategory === subCategory &&
          item.orderNumber === orderNumber
      );
      if (index > -1) {
        repeatMap.set(index, i);
      }
    }
    if (repeatMap.size <= 0) {
      // 不存在重复
      return [...orderList, ...cutterList];
    }
    const confirmPrmoiseFun = (older: Cutter[], newer: Cutter[]) => {
      return new Promise<Cutter[]>((resolve) => {
        confirm({
          type: "warning",
          title: "刀具信息重复",
          content: `将要导入的刀具信息中存在与现订单中的刀具的信息重复，是否覆盖？`,
          okText: "覆盖",
          cancelText: "跳过",
          onOk() {
            // 覆盖
            const newOlder = produce(older, (draft) => {
              repeatMap.forEach((value, key) => {
                draft.splice(key, 1, cutterList[value]);
                newer.splice(value, 1);
              });
              return draft;
            });
            resolve([...newOlder, ...newer]);
          },
          onCancel() {
            repeatMap.forEach((value) => {
              newer.splice(value, 1);
            });
            resolve([...older, ...newer]);
          },
        });
      });
    };
    const newCutterList = await confirmPrmoiseFun(orderList, cutterList);
    return newCutterList;
  }
);

/**
 * 添加收藏
 */
export const collection = createAsyncThunk<void, Cutter[]>(
  createActions(ACTION_TYPES.ORDER_COLLECTION, ACTION_PREFIX_ORDER).type,
  async (cutterList, { getState }) => {
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
    collectionApi
      .save(newCutterList)
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
export const orderListSubmit = createAsyncThunk<{ orderNo: string }, Cutter[]>(
  createActions(ACTION_TYPES.ORDER_LIST_SUBMIT).type,
  async (orderList) => {
    const modelNumber = orderList.length;
    const quantity = orderList.reduce<number>((count, current) => {
      let total = count;
      total += +current?.quantity;
      return total;
    }, 0);
    const orders = orderList.map((item) => ({
      orderNumber: item.orderNumber,
      category: item.category,
      subCategory: item.subCategory,
      manufacturer: item.manufacturer,
      quantity: item.quantity,
    }));
    const body = {
      modelNumber,
      quantity,
      orders,
    };
    const response = await orderApi.submit<{ orderNo: string }>(body);
    return response;
  }
);

/**
 * 查询历史订单
 */
export const getHistoryOrder = createAsyncThunk<
  SubmitOrderType[],
  HistoryParamType
>(
  createActions(ACTION_TYPES.GET_HISTORY_ORDER, ACTION_PREFIX_ORDER).type,
  async (param) => {
    const response = await orderApi.search<SubmitOrderType[]>({ ...param });
    return response;
  }
);

/**
 * 获取订单完整信息
 */
export const historyOrderDetail = createAsyncThunk<unknown, Key>(
  createActions(ACTION_TYPES.HISTORY_ORDER_DETAIL, ACTION_PREFIX_ORDER).type,
  async (orderNo) => {
    const response = await orderApi.detail({ orderNo });
    return response;
  }
);

/**
 * 续建订单
 */
export const recreateOrder = createAsyncThunk<unknown, Key>(
  "",
  async (orderNo, { dispatch }) => {
    const order = dispatch(historyOrderDetail(orderNo));
  }
);
