import { createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "utils/api";
import { Interceptors } from "utils/axios";
import { errorMsg, successMsg } from "../global";
import TypePrefix from "./actionTypes";
import { LoginBody, LoginRespData, UserInfo } from "./interface";

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
export const userLogout = createAsyncThunk("user/logout", async () => {
  const response = await userApi.logout();
  return response;
});

/**
 * 用户信息更新
 */
export const userInfoUpdate = createAsyncThunk(
  "user/userInfoUpdate",
  async (body: UserInfo, { dispatch }) => {
    const interceptors: Interceptors = {
      responseCatchHook() {
        dispatch(errorMsg("保存失败"));
      },
    };
    await userApi.update({ ...body }, { interceptors });
    dispatch(successMsg("保存成功"));
    return body;
  }
);
