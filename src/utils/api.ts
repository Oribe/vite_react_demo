/**
 * 请求api
 */

import { createAxiosGroup } from "./axios";

export const formApi = createAxiosGroup({
  getManufacturer: { url: "/form/manufacturer", method: "GET" },
});
