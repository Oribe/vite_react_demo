import { combineReducers } from "redux";
import user from "./modules/user";

const reducers = {
  user,
};

const rootReducer = combineReducers(reducers);

export default rootReducer;

export type Reducers = typeof reducers;
export type RootReducer = ReturnType<typeof rootReducer>;
