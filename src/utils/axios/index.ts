import { message } from "antd";
import { Method } from "axios";
import { merge } from "lodash-es";
import store from "store/index";
import createAuthorization from "utils/auth";
import Axios from "./axios";
import { RESPONSE_OK } from "./const";
import {
  AxiosOptions,
  Interceptors,
  RequestData,
  RequestOptions,
} from "./type";

/**
 * @description 默认的拦截器、钩子
 */
const interceptors: Interceptors = {
  /**
   * @description 请求前拦截器
   */
  requestInterceptors(config) {
    const newConfig = config;
    const { uuid } = store.getState().user;
    newConfig.headers.Authorization = createAuthorization(uuid);
    return newConfig;
  },
  /**
   * @description 捕获拦截配置错误
   */
  requestInterceptorsCatch(error) {
    console.error(error);
  },
  /**
   * @description 请求响应后钩子
   */
  responseHook(response) {
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
  /**
   * @description 请求响应错误拦截钩子
   */
  responseCatchHook(error, options) {
    const { errorMessageMode } = options;
    const { data } = error.response;
    const { message: msg } = data;
    if (msg && errorMessageMode && errorMessageMode !== "none") {
      message.error(msg);
    }
    return data;
  },
};

const isProd = process.env.NODE_ENV === "production";

/**
 * 创建请求实例
 * @param options 请求配置
 */
function createAxios(options: AxiosOptions = {}) {
  return new Axios(
    merge<AxiosOptions, AxiosOptions>(
      {
        baseURL: isProd ? "/tool/interface" : "/api/tool/interface",
        timeout: 10 * 1000,
        interceptors,
      },
      options
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
  return <T = unknown>(data?: RequestData, requestConfig?: AxiosOptions) => {
    const newData: Record<string, unknown> = {};
    if (method.toUpperCase() === "GET") {
      newData.params = data;
    } else {
      newData.data = data;
    }

    const { interceptors: interce, requestOptions, ...config } =
      requestConfig || {};

    return axios.request<T>(
      {
        url,
        method,
        ...newData,
        ...config,
      },
      {
        interceptors: interce,
        requestOptions: { ...options, ...requestOptions },
      }
    );
  };
}

interface AxiosGroups {
  [key: string]: { url: string; method: Method; options?: RequestOptions };
}

type PreAxiosGroups<U extends string | number | symbol> = {
  [key in U]: <T = unknown>(
    data?: RequestData,
    config?: AxiosOptions
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
  const keys = Object.keys(axiosGroups);
  let { length } = keys;
  while (length) {
    length -= 1;
    const key = keys[length];
    const { method, url, options } = axiosGroups[key];
    const preAxios = createPreAxios(url, method, options);
    Reflect.set(group, key, preAxios);
  }
  return group;
}

export default axios;
export * from "./type";
