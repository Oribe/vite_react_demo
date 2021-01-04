import { AxiosRequestConfig, AxiosResponse } from "axios";
import Interceptors from "./interceptors";

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
  errorMessageMode?: any;
  // 是否加入时间戳
  joinTime?: boolean;
}

export interface AxiosOptions extends AxiosRequestConfig {
  interceptors?: Interceptors;
  requestOptions?: RequestOptions;
}

export interface ResponseOk<T = any> {
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
