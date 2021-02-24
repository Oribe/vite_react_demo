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
  getFormMenu: { url: "/form/menus", method: "GET" },
  getManufacturer: { url: "/form/manufacturer", method: "GET" },
  getFormConfig: { url: "", method: "GET" },
});

/**
 * 订单模块请求
 */
export const orderApi = createAxiosGroup({
  searchOrderNumber: { url: "/cutter", method: "GET" },
  collection: { url: "/collection", method: "POST" },
});
