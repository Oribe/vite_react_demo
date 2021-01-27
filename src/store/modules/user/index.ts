import { createSlice } from "@reduxjs/toolkit";
import { userLogin } from "./actions";
import initialState from "./state";

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.userInfo = action.payload?.userInfo;
      state.uuid = action.payload?.uuid;
      state.isLogin = true;
      return state;
    });
  },
});

export const user = userSlice.reducer;
export * from "./actions";
export * from "./state";
export * from "./interface";
