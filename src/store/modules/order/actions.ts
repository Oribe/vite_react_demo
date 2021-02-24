import { createAsyncThunk } from "@reduxjs/toolkit";
import { orderApi } from "utils/api";
import { Cutter } from "./interface";

interface SearchOrderNumberQuery {
  orderNumber: string;
  subCategory: number;
}
/**
 * 订货号搜索
 */
export const searchOrderNumber = createAsyncThunk(
  "order/searchOrderNumber",
  async ({ orderNumber, subCategory }: SearchOrderNumberQuery) => {
    console.log(orderNumber, subCategory);
    const response = await orderApi.searchOrderNumber({
      orderNumber: orderNumber.toUpperCase(),
      subCategory,
    });
    return response;
  }
);

/**
 * 添加收藏
 */
export const collection = createAsyncThunk(
  "order/collection",
  async (cutter: Cutter) => {
    const result = await orderApi.collection(cutter);
    return result;
  }
);
