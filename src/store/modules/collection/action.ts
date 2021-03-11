import { createAsyncThunk } from "@reduxjs/toolkit";
import { collectionApi } from "utils/api";
import { Cutter } from "../order";
import { CollectionType } from "./interface";

/**
 * 搜索收藏
 */
export const collectionSearch = createAsyncThunk(
  "collection/search",
  async (subCategory?: number) => {
    const result = await collectionApi.search<CollectionType[]>({
      subCategory,
    });
    return result;
  }
);

/**
 * 导入
 */
export const importCollectionToOrderList = createAsyncThunk(
  "collection/import",
  async (collectionList: number[], { dispatch }) => {
    const result = await collectionApi.collectionDetail<Cutter[]>({
      ids: collectionList.toString(),
    });
    console.log(result);
  }
);
