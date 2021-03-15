import axios, { AxiosRequestConfig, Canceler } from "axios";
import { isFunction } from "lodash-es";

/**
 * @description 初始化一个Map,用于存放请求
 */
function initRequestMap() {
  return new Map<string, Canceler>();
}

/**
 *  @description 定义一个用于存放请求的Map
 */
let requestMap = initRequestMap();

/**
 * @description 获取请求的方法和地址
 */
function getRequestUrl(config: AxiosRequestConfig) {
  return [config.method, config.url].join("&");
}

class CancelToken {
  static add(config: AxiosRequestConfig) {
    const newConfig = config;
    const url = getRequestUrl(newConfig);
    newConfig.cancelToken =
      config.cancelToken ??
      new axios.CancelToken((cancel: Canceler) => {
        if (!requestMap.has(url)) {
          requestMap.set(url, cancel);
        }
      });
    return newConfig;
  }

  static removeAll() {
    requestMap.forEach((cancel) => {
      if (cancel && isFunction(cancel)) {
        cancel();
      }
    });
    requestMap.clear();
  }

  /**
   * @description 删除之前的请求
   */
  static remove(config: AxiosRequestConfig) {
    const url = getRequestUrl(config);
    if (requestMap.has(url)) {
      /**
       * 如果存在，取消就取消之前的请求
       */
      const cancel = requestMap.get(url);
      if (cancel) {
        cancel();
      }
      requestMap.delete(url);
    }
  }

  /**
   * @description 重置
   */
  static reset() {
    requestMap = initRequestMap();
  }
}

export default CancelToken;
