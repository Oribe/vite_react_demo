import { message } from "antd";
import { AxiosRequestConfig, Method } from "axios";
import { merge } from "lodash-es";
import Axios from "./axios";
import { RESPONSE_OK } from "./const";
import Interceptors from "./interceptors";
import { AxiosError, AxiosOptions, RequestOptions } from "./type";

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

function createPreAxios(url: string, method: Method, options?: RequestOptions) {
  return <T = unknown>(
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ) => {
    return axios.request<T>(
      {
        ...config,
        url,
        method,
        data,
      },
      options
    );
  };
}

interface AxiosGroups {
  [key: string]: { url: string; method: Method; options?: RequestOptions };
}

type PreAxiosGroups<T extends string | number | symbol> = {
  [key in T]: (
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ) => Axios["request"];
};

export function createAxiosGroup<T extends AxiosGroups, U extends keyof T>(
  axiosGroups: T
): PreAxiosGroups<U> {
  const group = {} as PreAxiosGroups<U>;
  for (const key in axiosGroups) {
    const { method, url, options } = axiosGroups[key];
    Reflect.set(group, key, createPreAxios(url, method, options));
  }

  return group;
}

export default axios;
