import { message } from "antd";
import { merge } from "lodash-es";
import Axios from "./axios";
import { RESPONSE_OK } from "./const";
import Interceptors from "./interceptors";
import { AxiosError, AxiosOptions } from "./type";

const interceptors: Interceptors = {
  afterResponseHook(response, options) {
    const { data } = response;
    const isSuccess = data && Reflect.has(data, "code");
    if (isSuccess) {
      const { code } = data;
      if (code === RESPONSE_OK) {
        return data.data;
      }
    }
    throw new Error("返回数据错误");
  },

  responseCatchHook(error: AxiosError) {
    message.error(
      error?.response?.data?.message ?? error.message ?? "请求失败"
    );
    return;
  },
};

const isProd = process.env.NODE_ENV === "production";

function createAxios(options?: AxiosOptions) {
  return new Axios(
    merge<AxiosOptions, AxiosOptions>(
      {
        baseURL: isProd ? "/tool/interface" : "/api/tool/interface",
        timeout: 10 * 1000,
        interceptors,
      },
      options || {}
    )
  );
}

const axios = createAxios();

export default axios;
