import { createAsyncThunk } from "@reduxjs/toolkit";
import { isEmpty } from "lodash-es";
import { RootReducer } from "store/store";
import { ThunkApiConfig } from "store/type";
import { createActinos } from "utils/index";
import { formApi } from "utils/api";
import { FormConfig, FormMenu, Options } from "./interface";

/**
 * actionTypes
 */
const PREFIX_ACTION_TYPES = "form";
export const ACTION_TYPES = {
  SWITCH_MENU_TO_ROUTERS: "SWITCH_MENU_TO_ROUTERS",
  GET_FORM_MENU: "GET_FORM_MENU",
  GET_FORM_CONFIG: "GET_FORM_CONFIG",
  GET_MANUFACTURER: "GET_MANUFACTURER",
};

/**
 * 获取表侧边栏
 */
export const getFormMenu = createAsyncThunk<FormMenu[], void, ThunkApiConfig>(
  createActinos(ACTION_TYPES.GET_FORM_MENU, PREFIX_ACTION_TYPES).type,
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
      createActinos(
        ACTION_TYPES.SWITCH_MENU_TO_ROUTERS,
        PREFIX_ACTION_TYPES
      )(response)
    );
    return response;
  }
);

/**
 * 获取表单配置
 */
export const getFormConfig = createAsyncThunk(
  createActinos(ACTION_TYPES.GET_FORM_CONFIG, PREFIX_ACTION_TYPES).type,
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
  createActinos(ACTION_TYPES.GET_MANUFACTURER, PREFIX_ACTION_TYPES).type,
  async (_, { getState }) => {
    const { manufacturer } = (getState() as RootReducer).form;
    if (isEmpty(manufacturer)) {
      const response = await formApi.getManufacturer<Options[]>();
      return response;
    }
    return manufacturer;
  }
);
