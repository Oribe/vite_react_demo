import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./actions";
import initialState, { userInfo } from "./state";

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(actions.userLogin.fulfilled, (state, action) => {
      const newState = state;
      newState.userInfo = action.payload?.userInfo;
      newState.uuid = action.payload?.uuid;
      newState.isLogin = true;
      return newState;
    });
    addCase(actions.userInfoUpdate.fulfilled, (state, action) => {
      const newState = state;
      newState.userInfo = action.payload;
      return newState;
    });
    addCase(actions.userLogout.fulfilled, (state) => {
      const newState = state;
      newState.isLogin = false;
      newState.uuid = "";
      newState.userInfo = userInfo;
      return newState;
    });
  },
});

export const user = userSlice.reducer;
export * from "./actions";
export * from "./interface";
