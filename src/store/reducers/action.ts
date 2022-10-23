import { Action as ReduxAction } from "redux";

export interface Action extends ReduxAction<string> {
  type: string;
  payload: any;
};