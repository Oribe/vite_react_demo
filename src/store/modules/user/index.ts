import { createSlice } from "@reduxjs/toolkit";
import { userLogin } from "./asyncThunk";
import initialState from "./state";

const user = createSlice({
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

export default user.reducer;

export * from "./asyncThunk";
export * from "./state";
export * from "./type";
