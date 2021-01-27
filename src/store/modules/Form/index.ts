import { createSlice } from "@reduxjs/toolkit";
import { Act } from "store/type";
import { getFormMenu } from "./actions";
import { FormMenu } from "./interface";
import formState from "./state";

const formSlice = createSlice({
  name: "form",
  initialState: formState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFormMenu.fulfilled, (state, action: Act<FormMenu[]>) => {
      console.log("action", action);
      state.menu = action.payload || [];
    });
  },
});

export const form = formSlice.reducer;
export * from "./actions";
export * from "./interface";
