import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginBody, LoginRespData } from "./type";
import axios from "/@utils/axios";

/**
 * @description 登陆
 */
export const userLogin = createAsyncThunk(
  "USER/LOGIN",
  async (body: LoginBody) => {
    const response = await axios.post<LoginRespData>("/login", body);
    console.log(response);
    return response;
  }
);
