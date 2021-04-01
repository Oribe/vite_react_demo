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
  search: { url: "/cutter", method: "GET" },
  save: { url: "/cutter", method: "POST" },
  columns: { url: "/cutter/columns", method: "GET" },
});

/**
 * 订单模块请求
 */
export const orderApi = createAxiosGroup({
  submit: { url: "/order", method: "POST" },
  search: { url: "/order", method: "GET" },
  detail: { url: "/order/complete", method: "GET" },
  cache: { url: "/order/cache", method: "GET" },
  cacheDetail: { url: "/order/cache/detail", method: "GET" },
  cacheSave: { url: "/order/cache", method: "POST" },
  cacheDeleted: { url: "/order/cache", method: "DELETE" },
  cacheSubmit: { url: "/order/cache/submit", method: "POST" },
});

/**
 * 收藏
 */
export const collectionApi = createAxiosGroup({
  search: {
    url: "/collection",
    method: "GET",
    options: { errorMessageMode: "message" },
  },
  detail: { url: "/collection/complete", method: "GET" },
  save: { url: "/collection", method: "POST" },
});
