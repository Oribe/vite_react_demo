import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { isEmpty } from "lodash-es";
import { RootReducer } from "store/store";
import { ThunkApiConfig } from "store/type";
import { formApi } from "utils/api";
import { FormConfig, FormMenu, Options } from "./interface";

/**
 * actionTypes
 */
export const ACTION_TYPES = {
  SWITCH_MENU_TO_ROUTERS: "SWITCH_MENU_TO_ROUTERS",
};

/**
 * 自动识别payload类型
 */
function withPayloadType<T>() {
  return (t: T) => ({ payload: t });
}

/**
 * 动态创建actions
 */
export const createActinos = <T = unknown>(
  actionTypes: string,
  withPrefix?: boolean
) => {
  if (withPrefix) {
    return createAction(`form/${actionTypes}`, withPayloadType<T>());
  }
  return createAction(actionTypes, withPayloadType<T>());
};

/**
 * 获取表侧边栏
 */
export const getFormMenu = createAsyncThunk<FormMenu[], void, ThunkApiConfig>(
  "form/getFormMenu",
  async (_, { getState, dispatch }) => {
    /**
     * 数据存在时就直接返回
     */
    if (getState().form.menu.length > 0) {
      return getState().form.menu;
    }
    /**
     * 数据请求
     */
    const response = await formApi.getFormMenu<FormMenu[]>();
    dispatch(
      createActinos(ACTION_TYPES.SWITCH_MENU_TO_ROUTERS, true)(response)
    );
    return response;
  }
);

/**
 * 获取表单配置
 */
export const getFormConfig = createAsyncThunk(
  "form/getFormConfig",
  async (subCategory: number, { getState }) => {
    const state = getState() as RootReducer;
    const config = state.form.form[subCategory];
    if (config && !isEmpty(config)) {
      return { subCategory, config };
    }
    // const response = await axios.get<FormConfig>(`/form/${+subCategory}`);
    const response = await formApi.getFormConfig<FormConfig>(
      {},
      {
        // 重新配置请求地址
        url: `/form/${+subCategory}`,
      }
    );
    return { subCategory, config: response };
  }
);

/**
 * 制造商列表
 */
export const getManufacturer = createAsyncThunk(
  "form/getManufacturer",
  async (_, { getState }) => {
    const { manufacturer } = (getState() as RootReducer).form;
    if (isEmpty(manufacturer)) {
      const response = await formApi.getManufacturer<Options[]>();
      return response;
    }
    return manufacturer;
  }
);

/**
 * 根据subCategory获取category
 */
export category 
