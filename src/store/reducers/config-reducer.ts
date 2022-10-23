import { Reducer } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { Config } from "../../types";
import { Action } from "./action";
import { RootState } from "./root-reducer";

enum ConfigActionType {
  saveConfig = "SAVE_CONFIG",
  removeConfig = "REMOVE_CONFIG"
};

interface ConfigAction extends Action {
  type: ConfigActionType
};

export const useSaveConfig = () => {
  const dispatch = useDispatch();
  return (res: any) => dispatch({ type: ConfigActionType.saveConfig, payload: res })
};

export const useRemoveConfig = () => {
  const dispatch = useDispatch();
  return () => dispatch({ type: ConfigActionType.removeConfig })
};

export const useConfig = (): Config => {
  return useSelector<RootState, Config>((state) => state.configReducer);
}

const initialState: any = {};

export const configReducer: Reducer<Config, ConfigAction> = (
  state = initialState,
  action: ConfigAction,
) => {
  switch (action.type) {
    case ConfigActionType.saveConfig:
      return {
        ...state,
        ...action.payload
      };
    case ConfigActionType.removeConfig:
      return {} as Config;
    default:
      return state;
  }
};
