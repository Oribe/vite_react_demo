import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { AxiosOptions, RequestOptions, ResponseOk } from "./type";
import { isFunction, cloneDeep, after } from "lodash-es";
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
  setHeader(headers: any) {
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
  setInterceptors() {
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

    const axiosCancel = new CancelToken();

    /**
     * 请求拦截错误捕获
     */
    requestInterceptorsCatch &&
      isFunction(requestInterceptorsCatch) &&
      this.axiosInstance.interceptors.request.use(
        undefined,
        requestInterceptorsCatch
      );

    /**
     * 请求拦截
     */
    this.axiosInstance.interceptors.request.use((config) => {
      axiosCancel.add(config);
      const {
        headers: { ignoreCancelToke } = { ignoreCancelToke: false },
      } = config;
      if (!ignoreCancelToke) {
        axiosCancel.add(config);
      }
      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config);
      }
      return config;
    });

    /**
     * 响应错误捕获
     */
    responseInterceptorsCatch &&
      isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(
        undefined,
        responseInterceptorsCatch
      );

    /**
     * 响应拦截
     */
    this.axiosInstance.interceptors.response.use((response) => {
      axiosCancel.remove(response.config);
      if (responseInterceptors && isFunction(responseInterceptors)) {
        response = responseInterceptors(response);
      }
      return response;
    });
  }

  /**
   * 接口请求
   */
  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions) {
    let conf = cloneDeep(config);

    const { requestOptions } = this.options;
    const opt = Object.assign({}, requestOptions, options || {});

    const interceptors = this.getInterceptors();
    const { beforeRequestHook, afterResponseHook, responseCatchHook } =
      interceptors ?? {};

    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt);
    }

    return new Promise<T>((resolve, reject) => {
      this.axiosInstance
        .request<ResponseOk<T>>(config)
        .then((response) => {
          console.log("请求成功", response);
          if (afterResponseHook && isFunction(afterResponseHook)) {
            const resp = afterResponseHook<T>(response, opt);
            if (resp) {
              resolve(resp);
            } else {
              reject("request error");
            }
            return;
          }
          resolve(response.data.data);
        })
        .catch((error) => {
          console.log("请求失败", error.response);
          if (responseCatchHook && isFunction(responseCatchHook)) {
            reject(responseCatchHook(error));
            return;
          }
          reject();
        });
    });
  }

  /**
   * @description Post请求
   */
  post<T = any>(
    url: string,
    data: Record<string, any>,
    options?: RequestOptions
  ) {
    return this.request<T>({ url, data, method: "POST" }, options);
  }

  /**
   * @description Get请求
   */
  get<T = any>(
    url: string,
    params?: Record<string, any> | string,
    options?: RequestOptions
  ) {
    return this.request<T>({ url, params, method: "GET" }, options);
  }
}
