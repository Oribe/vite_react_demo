import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./store";

const store = configureStore({
  reducer: rootReducer,
});

export default store;

export type Store = typeof store;

export * from "./store";
export * from "./type";
