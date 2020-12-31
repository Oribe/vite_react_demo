import { AxiosRequestConfig, AxiosResponse } from "axios";
import { AxiosOptions, RequestOptions } from "./type";

export default abstract class Interceptors {
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
  afterResponseHook?: (response: AxiosResponse, options: RequestOptions) => any;

  /**
   * @description 请求错误钩子
   */
  responseCatchHook?: (error: Error) => Promise<any>;

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
  responseInterceptors?: <T = any, R = any>(response: AxiosResponse<T>) => R;

  /**
   * @description 响应错误拦截
   */
  responseInterceptorsCatch?: (error: Error) => void;
}
