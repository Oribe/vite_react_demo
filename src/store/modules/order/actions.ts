import {
  createAsyncThunk,
  Dispatch,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";
import { Modal } from "antd";
import { produce } from "immer";
import { Key } from "react";
import { RootReducer, ThunkApiConfig } from "store/store";
import { collectionApi, cutterApi, orderApi } from "utils/api";
import { Interceptors } from "utils/axios";
import { createActions } from "utils/index";
import { FormMenu } from "../form";
import { errorMsg, successMsg, warningMsg } from "../global";
import {
  Cutter,
  HistoryParamType,
  OrderItemsType,
  SubmitOrderType,
  TimeRangeParam,
  UncompletedOrder,
} from "./interface";

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
  HISTORY_ORDER_RECREATE: "HISTORY_ORDER_RECREATE",
  UNCOMPLETED_TABLE_STATUS: "UNCOMPLETED_TABLE_STATUS",
  ORDER_TABLE_STATUS: "ORDER_TABLE_STATUS",
};

const changeTableStatus = (
  dispatch: Dispatch,
  actionType: string,
  status: boolean
) => {
  dispatch({
    type: createActions(actionType, ACTION_PREFIX_ORDER).type,
    payload: status,
  });
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
export const addToOrderList = createAsyncThunk<Cutter, Cutter, ThunkApiConfig>(
  createActions(ACTION_TYPES.ADD_ORDER_LIST, ACTION_PREFIX_ORDER).type,
  async (order, { getState, dispatch }) => {
    const newOrder = await processCutter(order, getState);
    await cutterApi.save(newOrder);
    const orderListLen = getState().order.orderList.length;
    if (orderListLen >= 8) {
      const message = "刀具数量不能超过8条";
      dispatch(warningMsg(message));
      return Promise.reject(message);
    }
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
  async (cutterList, { getState, dispatch }) => {
    const newCutterList: (Cutter | Promise<Cutter>)[] = [];
    for (let i = 0; i < cutterList.length; i += 1) {
      const cutter = cutterList[i];
      delete cutter.quantity;
      delete cutter.createAt;
      delete cutter.updateAt;
      if (cutterList[i].category) {
        newCutterList.push(cutter);
      } else {
        newCutterList.push(processCutter(cutter, getState));
      }
    }
    try {
      await Promise.all(newCutterList);
    } catch (e) {
      dispatch(errorMsg("收藏失败"));
      return;
    }
    collectionApi
      .save(newCutterList)
      .then(() => {
        dispatch(successMsg("收藏成功"));
      })
      .catch((error) => {
        // console.log(error);
        dispatch(errorMsg(error?.message ?? "收藏失败"));
      });
  }
);

const generateOrderInfo = (orderList: Cutter[]) => {
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
  return body;
};

/**
 * 提交
 */
export const orderListSubmit = createAsyncThunk<{ orderNo: string }, Cutter[]>(
  createActions(ACTION_TYPES.ORDER_LIST_SUBMIT).type,
  async (orderList) => {
    const body = generateOrderInfo(orderList);
    const response = await orderApi.submit<{ orderNo: string }>(body);
    return response;
  }
);

/**
 * 获取订单完整信息
 */
export const historyOrderDetail = createAsyncThunk(
  createActions(ACTION_TYPES.HISTORY_ORDER_DETAIL, ACTION_PREFIX_ORDER).type,
  async (orderNo: Key) => {
    const response = await orderApi.detail<SubmitOrderType>({ orderNo });
    return response;
  }
);

/**
 * 续建订单
 */
export const recreateOrder = createAsyncThunk<void, Key>(
  createActions(ACTION_TYPES.HISTORY_ORDER_RECREATE, ACTION_PREFIX_ORDER).type,
  async (orderNo, { dispatch }) => {
    const actions = await dispatch(historyOrderDetail(orderNo));
    if (isRejected(actions)) {
      dispatch(errorMsg(actions.error.message || "续建失败"));
    }
    if (isFulfilled(actions)) {
      const addResult = await dispatch(
        addListToOrderList(actions.payload.orders)
      );
      if (isFulfilled(addResult)) {
        dispatch(successMsg("续建成功"));
      }
      if (isRejected(addResult)) {
        dispatch(errorMsg(addResult.error.message || "续建失败"));
      }
    }
  }
);

/**
 * 生成二维码
 */
export const createQRcode = createAsyncThunk<
  string,
  OrderItemsType[] | undefined,
  ThunkApiConfig
>("order/createQRcode", (data, { getState }) => {
  let QRcodeText = "";
  if (!Array.isArray(data)) {
    return QRcodeText;
  }
  const config = getState().form.cutterDataIndexs;
  const phone = getState().user.userInfo.userName;
  let i = 0;
  const { length } = data;
  while (i < length) {
    const valueObj = data[i];
    const { subCategory } = valueObj;
    const dataIndexList = config[subCategory];
    const text = dataIndexList.reduce<string>((t, dataIndex) => {
      const value = valueObj[dataIndex];
      return `${t}|${value ?? " "}`; // 如果之不存在则中间使用空格隔开
    }, "/IN");
    QRcodeText += `${text}|${phone}`;
    i += 1;
  }
  return QRcodeText;
});

/**
 * 订单暂存为未完成订单
 */
export const saveUncompletedOrders = createAsyncThunk<
  { orderNo: string },
  Cutter[]
>("order/saveUncompletedOrders", async (orderList) => {
  const body = generateOrderInfo(orderList);
  const response = await orderApi.cacheSave<{ orderNo: string }>(body);
  return response;
});

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
 * 获取缓存订单详情
 */
export const getHistoryOrderDetail = createAsyncThunk(
  "order/getHistoryOrderDetail",
  async (orderNo: string, { dispatch }) => {
    changeTableStatus(dispatch, ACTION_TYPES.ORDER_TABLE_STATUS, true);
    const interceptors: Interceptors = {
      responseCatchHook() {
        changeTableStatus(dispatch, ACTION_TYPES.ORDER_TABLE_STATUS, false);
      },
    };
    const response = await orderApi.cacheDetail<Cutter[]>(
      { orderNo },
      { interceptors }
    );
    return response;
  }
);

/**
 * 查询未完成订单
 */
export const getUncompletedOrders = createAsyncThunk<
  UncompletedOrder[],
  TimeRangeParam
>("order/getUncompletedOrders", async (param) => {
  const response = await orderApi.cache<UncompletedOrder[]>({ ...param });
  return response;
});

/**
 *  删除暂存订单
 */
export const deleteUncompletedOrders = createAsyncThunk(
  "order/deleteUncompletedOrders",
  async (ids: Key[], { dispatch }) => {
    if (ids.length <= 0) {
      dispatch(warningMsg("请先选择一条订单"));
      return Promise.reject();
    }
    const interceptors: Interceptors = {
      responseCatchHook() {
        dispatch(errorMsg("删除失败"));
      },
    };
    await orderApi.cacheDeleted({ ids }, { interceptors });
    dispatch(errorMsg("删除成功"));
    return ids;
  }
);

/**
 * 提交未完成订单
 */
export const submitUncompletedOrder = createAsyncThunk(
  "order/submitUncompletedOrder",
  async (ids: Key[], { dispatch }) => {
    if (ids.length <= 0) {
      dispatch(warningMsg("请先选择一条订单"));
      return Promise.reject();
    }
    changeTableStatus(dispatch, ACTION_TYPES.UNCOMPLETED_TABLE_STATUS, true);
    const interceptors: Interceptors = {
      responseCatchHook() {
        dispatch(errorMsg("提交失败"));
        changeTableStatus(
          dispatch,
          ACTION_TYPES.UNCOMPLETED_TABLE_STATUS,
          false
        );
      },
    };
    await orderApi.cacheSubmit({ ids }, { interceptors });
    dispatch(successMsg("提交成功"));
    changeTableStatus(dispatch, ACTION_TYPES.UNCOMPLETED_TABLE_STATUS, true);
    return ids;
  }
);
