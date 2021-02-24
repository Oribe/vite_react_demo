import { message } from "antd";
import { AxiosRequestConfig, Method } from "axios";
import { merge } from "lodash-es";
import Axios from "./axios";
import { RESPONSE_OK } from "./const";
import Interceptors from "./interceptors";
import { AxiosError, AxiosOptions, RequestOptions } from "./type";
/**
 * 拦截器、钩子
 */
const interceptors: Interceptors = {
  afterResponseHook(response) {
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

/**
 * 创建请求实例
 * @param options 请求配置
 */
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

/**
 * 预处理，
 * 提前将请求地址和请求类型配置
 * @param url 请求地址
 * @param method 请求类型
 * @param options 其他配置
 */
function createPreAxios(url: string, method: Method, options?: RequestOptions) {
  return <T = unknown>(
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ) => {
    const _data: Record<string, unknown> = {};
    if (method.toUpperCase() === "GET") {
      _data.params = data;
    } else {
      _data.data = data;
    }
    return axios.request<T>(
      {
        url,
        method,
        ..._data,
        ...config,
      },
      options
    );
  };
}

interface AxiosGroups {
  [key: string]: { url: string; method: Method; options?: RequestOptions };
}

type PreAxiosGroups<U extends string | number | symbol> = {
  [key in U]: <T = unknown>(
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ) => Promise<T>;
};

/**
 * 预处理请求组模块
 * @param axiosGroups
 */
export function createAxiosGroup<T extends AxiosGroups, U extends keyof T>(
  axiosGroups: T
): PreAxiosGroups<U> {
  const group = {} as PreAxiosGroups<U>;
  for (const key in axiosGroups) {
    const { method, url, options } = axiosGroups[key];
    const preAxios = createPreAxios(url, method, options);
    Reflect.set(group, key, preAxios);
  }
  return group;
}

export default axios;
