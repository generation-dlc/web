import { combineReducers } from "redux";
import { User, Config } from "../../types";
import { authReducer, AuthState } from "./auth-reducer";
import { configReducer } from "./config-reducer";
import { userReducer } from "./user-reducer";

export type RootState = {
  authReducer: AuthState;
  userReducer: User,
  configReducer: Config
};

export default combineReducers<RootState>({
  authReducer,
  userReducer,
  configReducer
});
