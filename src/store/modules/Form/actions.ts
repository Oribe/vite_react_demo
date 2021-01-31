import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "utils/axios";
import { FormMenu } from "./interface";

/**
 * 获取表侧边栏
 */
export const getFormMenu = createAsyncThunk("form/getFormMenu", async () => {
  const response = await axios.get<FormMenu[]>("/form/menus");
  return response;
});

/**
 * 获取表单配置
 */
export const getFormConfig = createAsyncThunk(
  "form/getFormConfig",
  async (subCategory: number) => {
    const response = await axios.get(`/form/${+subCategory}`);
    return { subCategory, config: response };
  }
);
