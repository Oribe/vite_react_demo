import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginBody, LoginRespData } from "./interface";
import TypePrefix from "./actionTypes";
import axios from "utils/axios";

/**
 * @description 登陆
 */
export const userLogin = createAsyncThunk(
  TypePrefix.LOGIN,
  async (body: LoginBody) => {
    const response = await axios.post<LoginRespData>("/login", body);
    console.log(response);
    return response as LoginRespData;
  }
);
