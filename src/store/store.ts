import { combineReducers } from "@reduxjs/toolkit";
import { user } from "store/modules/user";
import { form } from "store/modules/form";
import { order } from "store/modules/order";
import { collection } from "store/modules/collection";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session";
import { Action, Dispatch } from "redux";

const reducers = {
  user,
  form,
  order,
  collection,
};

const rootReducer = combineReducers(reducers);

const persistedReducer = persistReducer(
  {
    key: "root",
    storage,
    whitelist: ["user"],
  },
  rootReducer
);

export default persistedReducer;

/**
 * actions
 */
export interface Act<T = unknown> extends Action {
  payload?: T;
}

export interface ThunkApiConfig<T = unknown> {
  state: RootReducer;
  dispatch?: Dispatch;
  extra?: unknown;
  rejectValue?: T;
  serializedErrorType?: unknown;
}

export type Reducers = typeof reducers;
export type RootReducer = ReturnType<typeof rootReducer>;
