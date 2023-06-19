import { Action } from "./action";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reducers/root-reducer";
import { Reducer } from "redux";

export type AuthState = {
  wantsToAuthentificate: boolean;
  token: string | null;
  refreshToken: string | null;
};

const initialState: AuthState = {
  wantsToAuthentificate: false,
  token: null,
  refreshToken: null,
};

export type AuthActionPayload = {
  wantsToAuthentificate: boolean,
  token: string | null,
  refreshToken: string | null
}

enum AuthActionType {
  wantsToAuthentificate = "WANTS_TO_AUTHENTIFICATE",
  saveToken = "SAVE_TOKEN",
  removeToken = "REMOVE_TOKEN",
}

export interface AuthAction extends Action {
  type: AuthActionType,
  payload: AuthActionPayload
}

export const useSaveToken = () => {
  const dispatch = useDispatch();
  return (res: any) => dispatch({ type: AuthActionType.saveToken, payload: res });
};

export const useRemoveToken = () => {
  const dispatch = useDispatch();
  return () => dispatch({ type: AuthActionType.removeToken });
};

export const useEditWantsToAuthentificate = () => {
  const dispatch = useDispatch();
  return (res: any) => dispatch({ type: AuthActionType.wantsToAuthentificate, payload: res });
};

export const useToken = (): string | null => {
  return useSelector<RootState, string | null>((state) => state.authReducer.token);
}

export const useRefreshToken = (): string | null => {
  return useSelector<RootState, string | null>((state) => state.authReducer.refreshToken);
}

export const authReducer: Reducer<AuthState, AuthAction> = (
  state = initialState,
  action: AuthAction,
) => {
  switch (action.type) {
    case AuthActionType.wantsToAuthentificate:
      return {
        ...state,
        wantsToAuthentificate: action.payload.wantsToAuthentificate
      }
    case AuthActionType.saveToken:
      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
      };
    case AuthActionType.removeToken:
      return { ...state, token: null, refreshToken: null };
    default:
      return state;
  }
};
