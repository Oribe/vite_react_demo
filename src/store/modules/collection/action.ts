import { createAsyncThunk, isFulfilled, isRejected } from "@reduxjs/toolkit";
import { message } from "antd";
import { collectionApi } from "utils/api";
import { addListToOrderList, Cutter } from "../order";
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
    const result = await collectionApi.detail<Cutter[]>({
      ids: collectionList.toString(),
    });
    const importResult = await dispatch(addListToOrderList(result));
    if (isFulfilled(importResult)) {
      message.success("导入成功");
    }
    if (isRejected(importResult)) {
      message.error("导入失败");
    }
  }
);
