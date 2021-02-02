import { createAsyncThunk } from "@reduxjs/toolkit";
import { NavRouter } from "route/index";
import { ThunkApiConfig } from "store/type";
import axios from "utils/axios";
import { FormMenu, FormSubMenu } from "./interface";

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
    const response = await axios.get<FormMenu[]>("/form/menus");
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
  async (subCategory: number) => {
    const response = await axios.get(`/form/${+subCategory}`);
    return { subCategory, config: response };
  }
);

interface SearchOrderNumberQuery {
  orderNumber: string;
  subCategory: number;
}
/**
 * 订货号搜索
 */
export const searchOrderNumber = createAsyncThunk<
  any,
  SearchOrderNumberQuery,
  ThunkApiConfig
>("form/searchOrderNumber", async ({ orderNumber, subCategory }) => {
  const response = await axios.get("/cutter", {
    orderNumber,
    subCategory,
  });
  return response;
});
