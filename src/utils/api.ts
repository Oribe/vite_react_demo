/**
 * 请求api
 */

import { createAxiosGroup } from "./axios";

export const userApi = createAxiosGroup({
  login: { url: "/login", method: "POST" },
});

/**
 * 表单模块请求
 */
export const formApi = createAxiosGroup({
  getFormMenu: {
    url: "/form/menus",
    method: "GET",
    options: { errorMessageMode: "message" },
  },
  getManufacturer: { url: "/form/manufacturer", method: "GET" },
  getFormConfig: {
    url: "",
    method: "GET",
    options: { errorMessageMode: "message" },
  },
});

/**
 * 刀具信息模块
 */
export const cutterApi = createAxiosGroup({
  save: { url: "/cutter", method: "POST" },
  collection: { url: "/collection", method: "POST" },
});

/**
 * 订单模块请求
 */
export const orderApi = createAxiosGroup({
  searchOrderNumber: { url: "/cutter", method: "GET" },
  submit: { url: "/order", method: "POST" },
});

/**
 * 搜藏
 */
export const collectionApi = createAxiosGroup({
  search: {
    url: "/collection",
    method: "GET",
    options: { errorMessageMode: "message" },
  },
  collectionDetail: { url: "/collection/complete", method: "GET" },
});
