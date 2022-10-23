import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FormikHelpers, useFormik } from "formik";
import { object, string } from "yup";
import { SignInPayload, useAuthService } from "../../services/authentication";
import { useSaveToken } from "../../store/reducers/auth-reducer";
import { Link } from "react-router-dom";
import { createStyles, Paper, Title, Alert, TextInput, Button, Divider } from "@mantine/core";
import { HiMail } from "react-icons/hi";
import { BsMicrosoft } from "react-icons/bs";
import { CgDanger } from "react-icons/cg";
import { DisableableAnchor, CrakottePasswordInput } from "../common";
import { persistor } from "../../store";

const SignIn = () => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const authService = useAuthService();
  const saveToken = useSaveToken();

  const [loading, setLoading] = useState(false);
  const [azureLoading, setAzureLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>();

  // azure code
  const [searchParams, setSearchParams] = useSearchParams();
  const azureToken = searchParams.get("token");

  useEffect(() => {
    persistor.persist();
    setAzureLoading(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (azureToken) {
      setLoading(true);
      saveToken({ token: azureToken });
      searchParams.delete("token");
      setSearchParams(searchParams);
    }
  }, [azureToken]);

  const formik = useFormik<SignInPayload>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: object().shape({
      email: string().email(t("form.error.invalidEmail")).required(t("form.error.required")),
      password: string().required(t("form.error.required")),
    }),
    onSubmit: signInWithCrakotte,
  });

  function signInWithCrakotte(signInPayload: SignInPayload, actions: FormikHelpers<SignInPayload>) {
    authService.signIn(
      {
        loading: value => setLoading(value),
        error: error => setErrorMessage(error?.status === 401 ? error?.message : t("common.error.anErrorOccurredPleaseRetryLater")),
        success: res => {
          const { token, refreshToken } = res;
          saveToken({ token, refreshToken });
        },
      },
      signInPayload,
    );
  }

  function signInWithAzure() {
    setAzureLoading(true);
    authService.signInWithAzure(
      {
        loading: value => null,
        error: error => { setAzureLoading(false); setErrorMessage(error?.message) },
        success: res => { window.open(res, "_self") },
      }
    );
  }

  return (
    <>
      <Paper
        p="md"
        shadow="md"
        className={classes.formContainer}
        component="form"
        onSubmit={formik.handleSubmit}
        noValidate>
        <Title order={2}>{t("signIn.signIn")}</Title>
        <div>
          <Title order={6} className={classes.label}>
            {t("signIn.email")}
          </Title>
          <TextInput
            id="email"
            type="email"
            icon={<HiMail />}
            aria-label={t("signIn.email")}
            aria-required="true"
            autoComplete="on"
            placeholder={t("signIn.emailPlaceholder")}
            onChange={formik.handleChange}
            value={formik.values.email}
            error={!!formik.touched.email && !!formik.errors.email && formik.errors.email}
          />
        </div>

        <div>
          <Title order={6} className={classes.label}>
            {t("signIn.password")}
          </Title>
          <CrakottePasswordInput
            id="password"
            aria-label={t("signIn.password")}
            aria-required="true"
            placeholder={t("signIn.password")}
            autoComplete="on"
            onChange={formik.handleChange}
            value={formik.values.password}
            error={!!formik.touched.password && !!formik.errors.password && formik.errors.password}
          />
        </div>

        <DisableableAnchor size="sm" component={Link} to="/request-password" sx={{ alignSelf: "end" }} disabled={loading}>
          {t("signIn.forgotPassword")}
        </DisableableAnchor>

        <Button
          className="bg-orange-500 text-white"
          type="submit"
          loading={loading}
          disabled={azureLoading}
        >
          {t("signIn.continue")}
        </Button>

        <Divider
          my="xs"
          label={t("signIn.or")}
          labelPosition="center"
          styles={{ label: { color: "gray" } }}
          sx={{ fontWeight: 600, margin: "0 !important" }}
        />

        <Button
          className="bg-white"
          onClick={signInWithAzure}
          loading={azureLoading}
          disabled={loading}
          leftIcon={<BsMicrosoft width={18} height={18} />}
        >
          {t("signIn.continueWithMicrosoft")}
        </Button>
      </Paper>
      {errorMessage && (
        <Alert
          icon={<CgDanger />}
          sx={theme => ({ boxShadow: theme.shadows.md, position: "relative" })}
          color="red"
          radius="lg"
          variant="filled">
          {errorMessage}
        </Alert>
      )}
    </>
  );
};

const useStyles = createStyles(theme => ({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    borderRadius: theme.radius.lg,
    backdropFilter: "blur(2px)",
    backgroundColor: theme.colorScheme === "dark" ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.4)",
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
    position: "relative",
  },

  label: {
    fontWeight: 600,
    marginBottom: 5,
  },
}));

export default SignIn;
