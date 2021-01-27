import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "utils/axios";
import { FormMenu } from "./interface";

/**
 * 获取表侧边栏
 */
export const getFormMenu = createAsyncThunk("form/getFormMenu", async () => {
  const response = await axios.get<FormMenu[]>("/form");
  return response;
});
