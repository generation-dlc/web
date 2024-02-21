import { useEffect } from "react";
import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { Routes, Route, Navigate } from "react-router-dom";
import { fr, en } from "./translations";
import { Generations, AskEmail, ResetPassword, Maintenance, Users, Inbox, Transactions, Products, Events, Settings, Home, Redirection } from "./components/core";
import BaseLayout from "./components/layouts/BaseLayout";
import SignIn from "./components/authentication/SignIn";
import { useUserService } from "./services";
import { useRemoveProfile, useSaveProfile } from "./store/reducers/user-reducer";
import { useToken } from "./store/reducers/auth-reducer";
import { useProfile } from "./store/reducers/user-reducer";
import FormLayout from "./components/layouts/FormLayout";
import { UserRoles } from "./types";
import { useConfigService } from "./services/config";
import { useConfig, useRemoveConfig, useSaveConfig } from "./store/reducers/config-reducer";
import AppLayout from "./components/layouts/AppLayout";
import { useClearStore } from "./store";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      order: ["navigator"], // detect language from browser
    },
    resources: { fr: { translation: fr }, en: { translation: en } },
    fallbackLng: "en",
    debug: process.env.REACT_APP_ENV_NAME === "local",
  });

// temporary freeze language to french
i18n.changeLanguage("fr");

function App() {
  const { getProfile } = useUserService();
  const { getConfig } = useConfigService();
  const saveProfile = useSaveProfile();
  const removeProfile = useRemoveProfile();
  const saveConfig = useSaveConfig();
  const clearStore = useClearStore();
  const token = useToken();
  const profile = useProfile();
  const config = useConfig();

  useEffect(() => {
    if (token) {
      // getConfig({ success: res => saveConfig(res) });
      getProfile({
        success: res => {
          if (res.role !== UserRoles.ADMIN)
            clearStore()
          else
            saveProfile(res)
        }
      });
    } else
      removeProfile()
  }, [token]);

  return (
    <Routes>
      {token && profile.role === UserRoles.ADMIN
        ? <>
          <Route element={<AppLayout />}>
            <Route path="/generations" element={<Generations />} />
            <Route path="/users" element={<Users />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/products" element={<Products />} />
            <Route path="/events" element={<Events />} />
            <Route path="/settings" element={<Settings />} />
            <Route index element={<Navigate to="/generations" replace />} />
          </Route>
          <Route path="/sign-in" element={<Navigate to="/generations" replace />} />
          {/* <Route path="*" element={<Navigate to="/generations" replace />} /> */}
        </>
        : config.isDisabled
          ? <Route element={<BaseLayout />}>
            <Route index element={<Maintenance />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          : <>
            <Route element={<FormLayout />}>
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/request-password" element={<AskEmail />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>
            <Route element={<BaseLayout />}>
              <Route path="/installation" element={<Home />} />
              <Route path="/redirection/:code" element={<Redirection />} />
            </Route>
            <Route path="*" element={<Navigate to="/sign-in" replace />} />
          </>
      }
    </Routes >
  )
}

export default App;
