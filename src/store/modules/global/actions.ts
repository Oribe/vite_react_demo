import { createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import { ConfigOptions, MessageInstance } from "antd/lib/message";

const messageConfig: ConfigOptions = {
  duration: 3,
};

message.config(messageConfig);

type MessageParam =
  | {
      message: string;
      duration: number;
    }
  | string;

const messageInfo = (
  type: keyof MessageInstance = "success",
  msg?: string,
  duration?: number,
  callback?: () => void
) => {
  if (type !== "open" && msg) {
    message[type](msg, duration, () => {
      if (callback) {
        callback();
      }
    });
  }
};

/**
 * 成功提示
 */
export const successMsg = createAsyncThunk(
  "global/success",
  (msg: MessageParam) => {
    return new Promise<void>((resolve) => {
      if (typeof msg === "string") {
        messageInfo("success", msg, messageConfig.duration, () => {
          resolve();
        });
      } else {
        messageInfo("success", msg.message, msg.duration, () => {
          resolve();
        });
      }
    });
  }
);

/**
 * 警告提示
 */
export const warningMsg = createAsyncThunk(
  "global/warning",
  (msg: MessageParam) => {
    return new Promise<void>((resolve) => {
      if (typeof msg === "string") {
        messageInfo("warning", msg, messageConfig.duration, () => {
          resolve();
        });
      } else {
        messageInfo("warning", msg.message, msg.duration, () => {
          resolve();
        });
      }
    });
  }
);

/**
 * 错误提示
 */
export const errorMsg = createAsyncThunk(
  "global/error",
  (msg: MessageParam) => {
    return new Promise<void>((resolve) => {
      if (typeof msg === "string") {
        messageInfo("error", msg, messageConfig.duration, () => {
          resolve();
        });
      } else {
        messageInfo("error", msg.message, msg.duration, () => {
          resolve();
        });
      }
    });
  }
);
