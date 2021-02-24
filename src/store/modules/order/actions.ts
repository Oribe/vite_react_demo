import { createAsyncThunk } from "@reduxjs/toolkit";
import { orderApi } from "utils/api";

interface SearchOrderNumberQuery {
  orderNumber: string;
  subCategory: number;
}
/**
 * 订货号搜索
 */
export const searchOrderNumber = createAsyncThunk(
  "form/searchOrderNumber",
  async ({ orderNumber, subCategory }: SearchOrderNumberQuery) => {
    console.log(orderNumber, subCategory);
    const response = await orderApi.searchOrderNumber({
      orderNumber: orderNumber.toUpperCase(),
      subCategory,
    });
    return response;
  }
);
