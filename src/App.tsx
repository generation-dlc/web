import { useEffect } from "react";
import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { Routes, Route, Navigate } from "react-router-dom";
import { fr, en } from "./translations";
import { Search, AskEmail, ResetPassword, Maintenance } from "./components/core";
import BaseLayout from "./components/layouts/BaseLayout";
import SignIn from "./components/authentication/SignIn";
import { useUserService } from "./services";
import { useRemoveProfile, useSaveProfile } from "./store/reducers/user-reducer";
import { useWantsToAuthentificate, useToken } from "./store/reducers/auth-reducer";
import { useProfile } from "./store/reducers/user-reducer";
import FormLayout from "./components/layouts/FormLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import { Roles } from "./types";
import { useConfigService } from "./services/config";
import { useConfig, useRemoveConfig, useSaveConfig } from "./store/reducers/config-reducer";
import AppLayout from "./components/layouts/AppLayout";
import Classified from "./components/core/Classified";
import Messages from "./components/core/Messages"

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
i18n.changeLanguage("en");

const authorizedEmails = [
  "guillaume.louis@reboot-conseil.com",
  "ahmed@reboot-conseil.com",
  "yaniv@reboot-conseil.com"
];

function App() {
  const { getProfile } = useUserService();
  const { getConfig } = useConfigService();
  const saveProfile = useSaveProfile();
  const removeProfile = useRemoveProfile();
  const saveConfig = useSaveConfig();
  const removeConfig = useRemoveConfig();
  const token = useToken();
  const profile = useProfile();
  const wantsToAuthentificate = useWantsToAuthentificate();
  const config = useConfig();

  useEffect(() => {
    if (token) {
      getConfig({ success: res => saveConfig(res) });
      getProfile({ success: res => saveProfile(res) });
    } else {
      removeConfig();
      removeProfile();
    }
  }, [token]);

  return (
    <Routes>
      {token && profile.role === Roles.ADMIN
        ? <>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="/admin/test" element={<>test</>} />
            <Route index element={<Navigate to="/admin/test" replace />} />
          </Route>
          <Route path="/sign-in" element={<Navigate to="/admin/test" replace />} />
          <Route path="*" element={<Navigate to="/admin/test" replace />} />
        </>
        : config.isDisabled
          ? <Route element={<BaseLayout />}>
            <Route index element={<Maintenance />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          : wantsToAuthentificate && !token
            ? <>
              <Route element={<FormLayout />}>
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/request-password" element={<AskEmail />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Route>
              <Route path="*" element={<Navigate to="/sign-in" replace />} />
            </>
            : <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/search" replace />} />
              <Route path="/search" element={<Search />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="classified-ad/:id" element={<Classified />} />
              <Route path="*" element={<>Error 404</>} />
            </Route>
      }
    </Routes>
  )
}

export default App;
