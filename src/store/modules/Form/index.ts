import { createSlice } from "@reduxjs/toolkit";
import { NavRouter } from "route/index";
import { Act } from "store/type";
import { createActions } from "utils/index";
import {
  ACTION_TYPES,
  getFormConfig,
  getFormMenu,
  getManufacturer,
} from "./actions";
import { FormMenu, FormSubMenu } from "./interface";
import formState from "./state";

const formSlice = createSlice({
  name: "form",
  initialState: formState,
  reducers: {
    /**
     * menu转换成routers
     */
    [createActions(ACTION_TYPES.SWITCH_MENU_TO_ROUTERS).type]: (
      state,
      action: Act<FormMenu[]>
    ) => {
      /**
       * 菜单列表转换成router配置
       */
      const menuToRouter = (
        menuList: (FormMenu | FormSubMenu)[]
      ): NavRouter[] => {
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
            router.routers = children;
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

      const { payload } = action;
      const routers = menuToRouter(payload || []) as typeof state.routers;
      state.routers = routers;
    },
  },
  extraReducers: ({ addCase }) => {
    /**
     * 接口获取菜单中
     */
    addCase(getFormMenu.pending, (state) => {
      state.menu.loading = true;
    });
    /**
     * 接口获取菜单成功
     */
    addCase(getFormMenu.fulfilled, (state, action: Act<Array<FormMenu>>) => {
      console.log("加载完成");
      if (action.payload) {
        return { ...state, menu: { data: action.payload, loading: false } };
      }
    });
    /**
     * 接口菜单获取失败
     */
    addCase(getFormMenu.rejected, (state) => {
      state.menu.loading = false;
    });
    /**
     * 获取表单配置中
     */
    addCase(getFormConfig.pending, (state) => {
      console.log("获取表单loading....");

      state.form.loading = true;
    });
    /**
     * 获取表单配置成功
     */
    addCase(getFormConfig.fulfilled, (state, action) => {
      const { subCategory, config } = action.payload || {};
      if (subCategory) {
        state.form.data[subCategory] = config;
      }
      state.form.loading = false;
    });
    /**
     * 获取表单配置失败
     */
    addCase(getFormConfig.rejected, (state) => {
      state.form.loading = true;
    });
    /**
     *
     */
    addCase(getManufacturer.fulfilled, (state, action) => {
      const { payload } = action;
      state.manufacturer.data = payload;
    });
  },
});

export const form = formSlice.reducer;
export * from "./actions";
export * from "./interface";

// Act<{ subCategory: number; config: FormConfig }
