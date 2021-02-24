import { createSlice } from "@reduxjs/toolkit";
import { NavRouter } from "route/index";
import { Act } from "store/type";
import { getFormConfig, getFormMenu, getManufacturer } from "./actions";
import formState from "./state";

const formSlice = createSlice({
  name: "form",
  initialState: formState,
  reducers: {
    getCategoryWithSub(state, action: Act<number>) {
      const subCategory = action.payload;
      const { menu } = state;
      menu.find((subMenu) => {
        if (subMenu.children) {
          // return subMenu.children.find((child) => );
        }
      });
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getFormMenu.fulfilled, (state, action: Act<Array<NavRouter>>) => {
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
      state.manufacturer = (action.payload as any) || [];
    });
  },
});

export const form = formSlice.reducer;
export * from "./actions";
export * from "./interface";

// Act<{ subCategory: number; config: FormConfig }
