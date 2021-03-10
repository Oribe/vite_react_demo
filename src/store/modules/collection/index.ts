/**
 * 收藏
 */

import { createSlice } from "@reduxjs/toolkit";
import collectionState from "./state";

const collectionSlice = createSlice({
  name: "collection",
  initialState: collectionState,
  reducers: {},
  extraReducers: {},
});

export const collection = collectionSlice.reducer;
export * from "./interface";
