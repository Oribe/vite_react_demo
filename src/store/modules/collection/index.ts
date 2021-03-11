/**
 * 收藏
 */

import { createSlice } from "@reduxjs/toolkit";
import { collectionSearch } from "./action";
import collectionState from "./state";

const collectionSlice = createSlice({
  name: "collection",
  initialState: collectionState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(collectionSearch.pending, (state) => {
      state.collectionList.loading = true;
    })
      .addCase(collectionSearch.rejected, (state) => {
        state.collectionList.loading = false;
        state.collectionList.data = [];
      })
      .addCase(collectionSearch.fulfilled, (state, action) => {
        state.collectionList.loading = false;
        state.collectionList.data = action.payload;
      });
  },
});

export const collection = collectionSlice.reducer;
export * from "./interface";
export * from "./action";
