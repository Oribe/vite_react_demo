import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginBody, LoginRespData } from "./interface";
import TypePrefix from "./actionTypes";
import { userApi } from "utils/api";

/**
 * @description 登陆
 */
export const userLogin = createAsyncThunk(
  TypePrefix.LOGIN,
  async (body: LoginBody) => {
    const response = await userApi.login<LoginRespData>(body);
    return response as LoginRespData;
  }
);
