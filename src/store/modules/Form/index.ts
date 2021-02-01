import { createSlice } from "@reduxjs/toolkit";
import { Act } from "store/type";
import { getFormConfig, getFormMenu } from "./actions";
import { FormConfig, FormMenu } from "./interface";
import formState from "./state";

const formSlice = createSlice({
  name: "form",
  initialState: formState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(getFormMenu.fulfilled, (state, action: Act<FormMenu[]>) => {
      state.menu = action.payload || [];
    });
    addCase(
      getFormConfig.fulfilled,
      (state, action: Act<{ subCategory: number; config: FormConfig }>) => {
        const { subCategory, config } = action.payload || {};
        if (subCategory) {
          state.form[subCategory] = config;
        }
      }
    );
  },
});

export const form = formSlice.reducer;
export * from "./actions";
export * from "./interface";