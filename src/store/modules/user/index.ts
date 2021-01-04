import { createSlice } from "@reduxjs/toolkit";
import { userLogin } from "./asyncThunk";
import { LoginRespData, UserState } from "./type";
import { Act } from "/@store/type";

const initialState = {} as UserState;

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: Act<LoginRespData>) {
      state.userInfo = action.payload?.userInfo;
      state.uuid = action.payload?.uuid;
    },
  },
  extraReducers: {
    [userLogin.fulfilled]: (state, action: Act<LoginRespData>) => {},
  },
});

export const { login } = user.actions;
export default user.reducer;

export * from "./asyncThunk";
export * from "./state";
export * from "./type";
