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
      const { collectionList } = state;
      collectionList.loading = true;
    })
      .addCase(collectionSearch.rejected, (state) => {
        const { collectionList } = state;
        collectionList.loading = false;
        collectionList.data = [];
      })
      .addCase(collectionSearch.fulfilled, (state, action) => {
        const { collectionList } = state;
        collectionList.loading = false;
        collectionList.data = action.payload;
      });
  },
});

export const collection = collectionSlice.reducer;
export * from "./interface";
export * from "./action";
