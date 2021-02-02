import { Action, Dispatch } from "redux";
import { RootReducer } from ".";

export interface Act<T = unknown> extends Action {
  payload?: T;
}

export interface ThunkApiConfig {
  state: RootReducer;
  dispatch?: Dispatch;
  extra?: unknown;
  rejectValue?: unknown;
  serializedErrorType?: unknown;
}
