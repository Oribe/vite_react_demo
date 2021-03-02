/**
 * 全局状态
 */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import { ConfigOptions, MessageInstance } from "antd/lib/message";

const messageConfig: ConfigOptions = {
  duration: 3,
};

message.config(messageConfig);

interface MessageParam {
  message?: string;
  callback?: () => void;
}

const messageInfo = (
  type: keyof MessageInstance = "success",
  msg?: string,
  callback?: () => void
) => {
  if (type !== "open" && msg) {
    message[type](msg, messageConfig.duration, () => {
      if (callback) {
        callback();
      }
    });
  }
};

const success = createAsyncThunk<void, MessageParam>(
  "global/success",
  (param) => {
    messageInfo("success", param.message, param.callback);
  }
);

const globalSlice = createSlice({
  name: "global",
  initialState: {},
  reducers: {},
  extraReducers: ({ addCase }) => {
    // addCase();
  },
});

export const { reducer } = globalSlice;
