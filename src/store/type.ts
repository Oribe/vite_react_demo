import { Action, Dispatch } from "redux";
import { RootReducer } from ".";

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
