import { AxiosRequestConfig, AxiosResponse } from "axios";
import { AxiosError, RequestOptions, ResponseOk } from "./type";

export abstract class Interceptors {
  /**
   * @description 请求发出之前钩子
   */
  beforeRequestHook?: (
    config: AxiosRequestConfig,
    options: RequestOptions
  ) => AxiosRequestConfig;

  /**
   * @description 请求成功后钩子
   */
  responseHook?: <T>(
    response: AxiosResponse<ResponseOk<T>>,
    options: RequestOptions
  ) => T;

  /**
   * @description 请求错误钩子
   */
  responseCatchHook?: (error: AxiosError, options: RequestOptions) => unknown;

  /**
   * @description 请求发出之前拦截请求配置
   */
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig;

  /**
   * @description 捕获请求发出之前拦截请求配置错误
   */
  requestInterceptorsCatch?: (error: Error) => void;

  /**
   * @description 响应拦截器
   */
  responseInterceptors?: <T = unknown, R = unknown>(
    response: AxiosResponse<ResponseOk<T>>
  ) => R;

  /**
   * @description 响应错误拦截
   */
  responseInterceptorsCatch?: (error: Error) => void;
}
