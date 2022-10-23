import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { useRemoveToken } from "./reducers/auth-reducer";
import rootReducer from "./reducers/root-reducer";
import { useRemoveProfile } from "./reducers/user-reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authReducer", "userReducer", "configReducer"]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);

export function useClearStore() {
  const removeToken = useRemoveToken();
  const removeUser = useRemoveProfile();

  return async () => {
    await persistor.purge();
    await persistor.pause();
    removeToken();
    removeUser();
  }
}