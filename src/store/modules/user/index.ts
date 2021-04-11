import { createSlice } from "@reduxjs/toolkit";
import { userInfoUpdate, userLogin } from "./actions";
import initialState from "./state";

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(userLogin.fulfilled, (state, action) => {
      const newState = state;
      newState.userInfo = action.payload?.userInfo;
      newState.uuid = action.payload?.uuid;
      newState.isLogin = true;
      return newState;
    });
    addCase(userInfoUpdate.fulfilled, (state, action) => {
      const newState = state;
      newState.userInfo = action.payload;
      return newState;
    });
  },
});

export const user = userSlice.reducer;
export * from "./actions";
export * from "./interface";
