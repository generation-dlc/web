import { useState } from "react";
import { useFormik } from "formik";
import { Trans, useTranslation } from "react-i18next";
import { ChangePasswordPayload } from "../../services/user";
import { object, ref, string } from "yup";
import { Button, createStyles, Paper, Title, Text, Alert, Anchor } from "@mantine/core";
import { CgDanger } from "react-icons/cg";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { useAuthService } from "../../services";
import { useSearchParams } from "react-router-dom";
import { useSaveToken } from "../../store/reducers/auth-reducer";
import { CrakottePasswordInput } from "../common";

type FormData = ChangePasswordPayload & {
  confirmPassword: string;
};

const ResetPassword = () => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const authService = useAuthService();
  const saveToken = useSaveToken();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>();
  const [successMessage, setSuccessMessage] = useState<string | null>();

  // url token
  const [searchParams, _] = useSearchParams();
  const token = searchParams.get("token");
  const userId = searchParams.get("id");

  const formik = useFormik<FormData>({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: object().shape({
      newPassword: string().required(t("form.error.required")),
      confirmPassword: string()
        .oneOf([ref("newPassword"), null], t("form.error.passwordsDontMatch"))
        .required(t("form.error.required")),
    }),
    onSubmit: (formData) => changePassword(formData.newPassword),
  });

  function changePassword(password: string) {
    setSuccessMessage(null);
    setErrorMessage(null);

    if (token && userId) {
      authService.resetPassword(
        {
          loading: value => setLoading(value),
          error: error => setErrorMessage("Impossible de réinitialiser le mot de passe"),
          success: res => saveToken({ token: res.token })
        },
        { token, userId, password }
      );
    }
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
        <Title order={4}>{t("changeTemporaryPassword.changeTemporaryPassword")}</Title>
        <div>
          <Title order={6} className={classes.label}>
            {t("changeTemporaryPassword.newPassword")}
          </Title>
          <CrakottePasswordInput
            id="newPassword"
            name="newPassword"
            aria-label={t("changeTemporaryPassword.newPassword")}
            aria-required="true"
            placeholder={t("changeTemporaryPassword.newPassword")}
            autoComplete="on"
            onChange={formik.handleChange}
            value={formik.values.newPassword}
            error={!!formik.touched.newPassword && !!formik.errors.newPassword && formik.errors.newPassword}
            withRules
          />
        </div>
        <div>
          <Title order={6} className={classes.label}>
            {t("changeTemporaryPassword.confirmPassword")}
          </Title>
          <CrakottePasswordInput
            id="confirmPassword"
            name="confirmPassword"
            aria-label={t("changeTemporaryPassword.confirmPassword")}
            aria-required="true"
            placeholder={t("changeTemporaryPassword.confirmPassword")}
            autoComplete="on"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            error={!!formik.touched.confirmPassword && !!formik.errors.confirmPassword && formik.errors.confirmPassword}
          />
        </div>
        <Text
          size="xs"
          sx={theme => ({ color: theme.colors.gray[7], paddingLeft: theme.spacing.xs, paddingRight: theme.spacing.xs })}>
          <Trans
            i18nKey="changeTemporaryPassword.bitwardenSuggestion"
            values={{ serviceName: "Bitwarden" }}
            components={{ linkText: <Anchor href="https://bitwarden.com/" target="_blank" size="xs" /> }}
          />
        </Text>
        <Button type="submit" loading={loading}>
          {t("changeTemporaryPassword.submit")}
        </Button>
      </Paper>
      {(errorMessage || successMessage) && (
        <Alert
          icon={errorMessage ? <CgDanger size={20} /> : <BsFillCheckCircleFill size={20} />}
          sx={theme => ({ boxShadow: theme.shadows.md })}
          color={errorMessage ? "red" : "crakotte"}
          radius="lg"
          variant="filled">
          {errorMessage || successMessage}
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

export default ResetPassword;
