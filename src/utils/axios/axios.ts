import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { isFunction, cloneDeep } from "lodash-es";
import {
  AxiosOptions,
  RequestOptions,
  RequestOptionsConfig,
  ResponseOk,
} from "./type";
import CancelToken from "./cancelToken";

export default class Axios {
  private axiosInstance!: AxiosInstance;

  private options: AxiosOptions;

  constructor(options: AxiosOptions) {
    this.options = options;
    this.initialAxios(options);
  }

  /**
   * @description 初始化axios
   */
  private initialAxios(config: AxiosOptions) {
    this.axiosInstance = axios.create(config);
    this.setInterceptors();
  }

  /**
   * @description 重新配置axios
   */
  resetConfig(config: AxiosOptions) {
    if (!config) {
      return;
    }
    this.initialAxios(config);
  }

  /**
   * @description 获取axios
   */
  getAxios() {
    return this.axiosInstance;
  }

  /**
   * @description 设置请求头
   */
  setHeader(headers: unknown) {
    if (!this.axiosInstance) {
      return;
    }
    Object.assign(this.axiosInstance.defaults.headers, headers);
  }

  private getInterceptors() {
    const { interceptors } = this.options;
    return interceptors;
  }

  /**
   * @description 设置拦截
   */
  private setInterceptors() {
    const interceptors = this.getInterceptors();

    if (!interceptors) {
      return;
    }

    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = interceptors;

    const axiosCancel = CancelToken;

    /**
     * 请求拦截错误捕获
     */
    if (requestInterceptorsCatch && isFunction(requestInterceptorsCatch)) {
      this.axiosInstance.interceptors.request.use(
        undefined,
        requestInterceptorsCatch
      );
    }

    /**
     * 请求拦截
     */
    this.axiosInstance.interceptors.request.use((config) => {
      let newConfig = config;
      axiosCancel.add(newConfig);
      const {
        headers: { ignoreCancelToke } = { ignoreCancelToke: false },
      } = newConfig;
      if (!ignoreCancelToke) {
        axiosCancel.add(newConfig);
      }
      if (requestInterceptors && isFunction(requestInterceptors)) {
        newConfig = requestInterceptors(newConfig);
      }
      return newConfig;
    });

    /**
     * 响应错误捕获
     */
    if (responseInterceptorsCatch && isFunction(responseInterceptorsCatch)) {
      this.axiosInstance.interceptors.response.use(
        undefined,
        responseInterceptorsCatch
      );
    }

    /**
     * 响应拦截
     */
    this.axiosInstance.interceptors.response.use((response) => {
      let newResp = response;
      axiosCancel.remove(newResp.config);
      if (responseInterceptors && isFunction(responseInterceptors)) {
        newResp = responseInterceptors(newResp);
      }
      return newResp;
    });
  }

  /**
   * 接口请求
   */
  request<T = unknown>(
    config: AxiosRequestConfig,
    { interceptors, requestOptions: options }: RequestOptionsConfig
  ) {
    let conf = cloneDeep(config);

    /**
     * options
     */
    const { requestOptions } = this.options;
    const opt = { ...requestOptions, ...(options || {}) };

    /**
     * interceptors
     */
    const interceptorsDefault = this.getInterceptors();
    const { beforeRequestHook, responseHook, responseCatchHook } =
      { ...interceptorsDefault, ...interceptors } ?? {};

    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt);
    }

    return new Promise<T>((resolve, reject) => {
      this.axiosInstance
        .request<ResponseOk<T>>(conf)
        .then((response) => {
          if (responseHook && isFunction(responseHook)) {
            const resp = responseHook<T>(response, opt);
            if (resp) {
              resolve(resp);
            } else {
              reject(new Error("request error"));
            }
            return;
          }
          resolve(response.data.data);
        })
        .catch((error) => {
          if (responseCatchHook && isFunction(responseCatchHook)) {
            reject(responseCatchHook(error, opt));
            return;
          }
          reject(error.response.data);
        });
    });
  }

  /**
   * @description Post请求
   */
  post<T = unknown>(
    url: string,
    data: Record<string, unknown>,
    requestOptions?: RequestOptions
  ) {
    return this.request<T>({ url, data, method: "POST" }, { requestOptions });
  }

  /**
   * @description Get请求
   */
  get<T = unknown>(
    url: string,
    params?: Record<string, unknown> | string,
    requestOptions?: RequestOptions
  ) {
    return this.request<T>({ url, params, method: "GET" }, { requestOptions });
  }
}
