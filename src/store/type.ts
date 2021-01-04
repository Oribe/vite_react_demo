import { Action } from "redux";

export interface Act<T = any> extends Action {
  payload?: T;
}
