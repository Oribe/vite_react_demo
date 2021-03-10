import { combineReducers } from "@reduxjs/toolkit";
import { user } from "store/modules/user";
import { form } from "store/modules/form";
import { order } from "store/modules/order";
import { collection } from "store/modules/collection";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session";

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

export type Reducers = typeof reducers;
export type RootReducer = ReturnType<typeof rootReducer>;
