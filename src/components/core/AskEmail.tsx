import { useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { RequestPasswordPayload, useAuthService } from "../../services/authentication";
import { object, string } from "yup";
import { createStyles, Paper, Button, TextInput, Title, Alert, SimpleGrid } from "@mantine/core";
import { CgDanger } from "react-icons/cg";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const AskEmail = () => {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const authService = useAuthService();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>();
  const [successMessage, setSuccessMessage] = useState<string | null>();

  const formik = useFormik<RequestPasswordPayload>({
    initialValues: {
      email: "",
    },
    validationSchema: object().shape({
      email: string().email(t("form.error.invalidEmail")).required(t("form.error.required")),
    }),
    onSubmit: requestPasswordReset,
  });

  function requestPasswordReset(requestPasswordPayload: RequestPasswordPayload) {
    setSuccessMessage(null);
    setErrorMessage(null);

    authService.requestPasswordReset(
      {
        loading: value => setLoading(value),
        error: error => setErrorMessage(error?.message),
        success: res => setSuccessMessage(res?.message),
      },
      requestPasswordPayload,
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
        <Title order={4}>{t("forgotPassword.forgotPassword")}</Title>
        <div>
          <Title order={6} className={classes.label}>
            {t("forgotPassword.emailLabel")}
          </Title>
          <TextInput
            id="email"
            type="email"
            aria-label={t("forgotPassword.email")}
            aria-required="true"
            placeholder={t("forgotPassword.emailPlaceholder")}
            autoComplete="on"
            onChange={formik.handleChange}
            value={formik.values.email}
            error={!!formik.touched.email && !!formik.errors.email && formik.errors.email}
          />
        </div>
        <SimpleGrid cols={2} spacing="sm" breakpoints={[{ maxWidth: "xs", cols: 1 }]}>
          <Button color="gray" onClick={() => navigate(-1)}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" loading={loading} sx={theme => ({ [theme.fn.smallerThan("xs")]: { gridRowStart: 1 } })}>
            {t("forgotPassword.submit")}
          </Button>
        </SimpleGrid>
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
    color: theme.colors.gray[6],
    marginBottom: 5,
  },
}));

export default AskEmail;
