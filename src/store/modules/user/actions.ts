import { createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "utils/api";
import { LoginBody, LoginRespData } from "./interface";
import TypePrefix from "./actionTypes";

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

/**
 * @description 登出
 */
export const userLogout = () => {
  //
};
