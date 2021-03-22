/**
 * 全局状态
 */

import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
  name: "global",
  initialState: {},
  reducers: {},
  extraReducers: ({ addCase }) => {
    // addCase();
  },
});

export const globalStore = globalSlice.reducer;

export * from "./actions";
