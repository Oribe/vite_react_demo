import { createAsyncThunk } from "@reduxjs/toolkit";
import { isEmpty } from "lodash-es";
import { NavRouter } from "route/index";
import { RootReducer } from "store/store";
import { ThunkApiConfig } from "store/type";
import { formApi } from "utils/api";
import { FormConfig, FormMenu, FormSubMenu, Options } from "./interface";

/**
 * 获取表侧边栏
 */
export const getFormMenu = createAsyncThunk<NavRouter[], void, ThunkApiConfig>(
  "form/getFormMenu",
  async (_, { getState }) => {
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
    /**
     * 菜单列表转换成router配置
     */
    const menuToRouter = (menuList: (FormMenu | FormSubMenu)[]) => {
      return menuList.reduce((routers, menu) => {
        const { name, imgUrl, subCategory } = menu;
        const router: NavRouter = {
          label: name,
          image: {
            src: imgUrl ? "http://localhost:3030" + imgUrl : "",
          },
        };
        if (Array.isArray(subCategory)) {
          /**
           * 存在子类
           */
          const children = menuToRouter(subCategory);
          router.children = children;
          routers.push(router);
          return routers;
        }
        /**
         * 不存在子类
         */
        router.path = "/order/add/" + subCategory;
        routers.push(router);

        return routers;
      }, [] as NavRouter[]);
    };

    return menuToRouter(response);
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
      const response = await formApi.getManufacturer<Options>();
      return response;
    }
    return manufacturer;
  }
);
