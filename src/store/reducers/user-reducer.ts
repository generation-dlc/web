import { Reducer } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./root-reducer";
import { Action } from "./action";
import { User } from "../../types";

enum UserActionType {
  saveProfile = "SAVE_PROFILE",
  removeProfile = "REMOVE_PROFILE",
}

interface UserAction extends Action {
  type: UserActionType
  // Other attributes from "Action"
}

export const useSaveProfile = () => {
  const dispatch = useDispatch();
  return (res: any) => dispatch({ type: UserActionType.saveProfile, payload: res })
};

export const useRemoveProfile = () => {
  const dispatch = useDispatch();
  return () => dispatch({ type: UserActionType.removeProfile });
};

export const useProfile = (): User => {
  return useSelector<RootState, User>((state) => state.userReducer);
};

const initialState: any = {};

export const userReducer: Reducer<User, UserAction> = (
  state = initialState,
  action: UserAction,
) => {
  switch (action.type) {
    case UserActionType.saveProfile:
      return {
        ...state,
        ...action.payload
      };
    case UserActionType.removeProfile:
      return {} as User;
    default:
      return state;
  }
};