import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FormikHelpers, useFormik } from "formik";
import { object, string } from "yup";
import { SignInPayload, useAuthService } from "../../services/authentication";
import { useSaveToken } from "../../store/reducers/auth-reducer";
import { Link } from "react-router-dom";
import { createStyles, Paper, Title, Alert, TextInput, Button, Divider, Center, Stack, Text } from "@mantine/core";
import { HiMail } from "react-icons/hi";
import { CgDanger } from "react-icons/cg";
import { DisableableAnchor, CustomPasswordInput } from "../common";
import { persistor } from "../../store";
import { useSaveProfile } from "../../store/reducers/user-reducer";

const SignIn = () => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const { signIn } = useAuthService();
  const saveToken = useSaveToken();
  const saveProfile = useSaveProfile();

  const [loading, setLoading] = useState(false);
  const [azureLoading, setAzureLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>();

  useEffect(() => {
    persistor.persist();
    setAzureLoading(false);
    setLoading(false);
  }, []);

  const formik = useFormik<SignInPayload>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: object().shape({
      email: string().email(t("form.error.invalidEmail")).required(t("form.error.required")),
      password: string().required(t("form.error.required")),
    }),
    onSubmit,
  });

  function onSubmit(signInPayload: SignInPayload, actions: FormikHelpers<SignInPayload>) {
    signIn(
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

  return (
    <>
      <Center mb={10}>
        <Stack align={"center"} style={{ gap: 5 }}>
          <Title order={1}>{t("signIn.signYou")}</Title>
          <Text size="xs" weight={500}>{t("signIn.signInExplanation")}</Text>
        </Stack>
      </Center>

      <Paper
        p="xl"
        shadow="xl"
        className={classes.formContainer}
        component="form"
        onSubmit={formik.handleSubmit}
        noValidate>
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
          <CustomPasswordInput
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
          {t("signIn.signIn")}
        </Button>
      </Paper>

      {
        errorMessage && (
          <Alert
            icon={<CgDanger />}
            sx={theme => ({ boxShadow: theme.shadows.md, position: "relative" })}
            color="red"
            radius="sm"
            variant="filled">
            {errorMessage}
          </Alert>
        )
      }
    </>
  );
};

const useStyles = createStyles(theme => ({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    borderRadius: theme.radius.md,
    backdropFilter: "blur(2px)",
    backgroundColor: "white",
    gap: theme.spacing.md,
    position: "relative",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#EAECEF"
  },

  label: {
    fontWeight: 600,
    marginBottom: 5,
  },
}));

export default SignIn;
