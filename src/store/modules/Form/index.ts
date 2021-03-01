import { createSlice } from "@reduxjs/toolkit";
import { NavRouter } from "route/index";
import { Act } from "store/type";
import {
  ACTION_TYPES,
  createActinos,
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
    // getCategoryWithSub(state, action: Act<number>) {
    //   const subCategory = Number(action.payload);
    //   const { menu } = state;
    //   const categoryObj = menu.find((subMenu) => {
    //     if (subMenu.subCategory && typeof Array.isArray(subMenu.subCategory)) {
    //       const { subCategory: children } = subMenu;
    //       return children.find(
    //         (child) => Number(child.subCategory) === subCategory
    //       );
    //     }
    //     return false;
    //   });
    //   return categoryObj?.category;
    // },
    [createActinos(ACTION_TYPES.SWITCH_MENU_TO_ROUTERS).type]: (
      state,
      action: Act<FormMenu[]>
    ) => {
      /**
       * 菜单列表转换成router配置
       */
      console.log("111");
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
    addCase(getFormMenu.fulfilled, (state, action: Act<Array<FormMenu>>) => {
      if (action.payload) {
        return { ...state, menu: action.payload };
      }
    });
    addCase(getFormConfig.fulfilled, (state, action) => {
      const { subCategory, config } = action.payload || {};
      if (subCategory) {
        state.form[subCategory] = config;
      }
    });
    addCase(getManufacturer.fulfilled, (state, action) => {
      const { payload } = action;
      state.manufacturer = payload;
    });
  },
});

export const form = formSlice.reducer;
export * from "./actions";
export * from "./interface";

// Act<{ subCategory: number; config: FormConfig }
