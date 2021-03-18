import { AxiosRequestConfig, AxiosResponse } from "axios";

export type ErrorMessageMode = "none" | "modal" | "message" | undefined;

export interface RequestOptions {
  // 请求参数拼接到url
  joinParamsToUrl?: boolean;
  // 格式化请求参数时间
  formatDate?: boolean;
  //  是否处理请求结果
  isTransformRequestResult?: boolean;
  // 是否加入url
  joinPrefix?: boolean;
  // 接口地址， 不填则使用默认apiUrl
  apiUrl?: string;
  // 错误消息提示类型
  errorMessageMode?: ErrorMessageMode;
  // 是否加入时间戳
  joinTime?: boolean;
  // 拦截器
}

export interface RequestOptionsConfig {
  interceptors?: Interceptors;
  requestOptions?: RequestOptions;
}

export interface AxiosOptions
  extends AxiosRequestConfig,
    RequestOptionsConfig {}

export interface ResponseOk<T = unknown> {
  code: number;
  data: T;
}

export interface ResponseError {
  detail: string;
  message: string;
  statusCode: number;
}

export interface AxiosError extends Error {
  response: AxiosResponse<ResponseError>;
}

export type RequestData =
  | Record<string, never | unknown>
  | unknown[]
  | undefined
  | null;

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
