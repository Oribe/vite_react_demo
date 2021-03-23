import { createAsyncThunk, isFulfilled } from "@reduxjs/toolkit";
import { isEmpty } from "lodash-es";
import { RootReducer, ThunkApiConfig } from "store/store";
import { cutterApi, formApi } from "utils/api";
import { createActions } from "utils/index";
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
  createActions(ACTION_TYPES.GET_FORM_MENU, PREFIX_ACTION_TYPES).type,
  async (_, { getState, dispatch }) => {
    /**
     * 数据存在时就直接返回
     */
    if (getState().form.menu.data.length > 0) {
      return getState().form.menu.data;
    }
    /**
     * 数据请求
     */
    const response = await formApi.getFormMenu<FormMenu[]>();
    dispatch(
      createActions(
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
  createActions(ACTION_TYPES.GET_FORM_CONFIG, PREFIX_ACTION_TYPES).type,
  async (subCategory: number, { getState }) => {
    const state = getState() as RootReducer;
    const config = state.form.form.data[subCategory];
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
  createActions(ACTION_TYPES.GET_MANUFACTURER, PREFIX_ACTION_TYPES).type,
  async (_, { getState }) => {
    const { manufacturer } = (getState() as RootReducer).form;
    if (isEmpty(manufacturer)) {
      const response = await formApi.getManufacturer<Options[]>();
      return response;
    }
    return manufacturer.data;
  }
);

/**
 * 获取生成二维码所需的字段顺序
 */
export const getCutterDataIndexs = createAsyncThunk<
  Record<number, string[]>,
  number[],
  ThunkApiConfig
>("order/getCutterDataIndexs", async (subCategoryList, { getState }) => {
  const cutterColumns = getState().form.cutterDataIndexs;
  const notExistSubCategory = subCategoryList.reduce<number[]>(
    (list, subCategory) => {
      const dataIndexList = cutterColumns?.[subCategory];
      if (!Array.isArray(dataIndexList)) {
        list.push(subCategory);
        return list;
      }
      return list;
    },
    []
  );
  let newCutterColumns = cutterColumns;
  if (notExistSubCategory.length > 0) {
    const response = await cutterApi.columns<Record<number, string[]>>({
      subCategories: notExistSubCategory.toString(),
    });
    newCutterColumns = { ...newCutterColumns, ...response };
  }
  return newCutterColumns;
});
