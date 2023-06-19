import { Global } from "@emotion/react";
import { Button, MantineProvider, Title, Text, Textarea, Stack, Group, ButtonProps, ColorScheme, ColorSchemeProvider, useMantineTheme, useMantineColorScheme } from "@mantine/core";
import { ContextModalProps, ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { useEffect, useMemo, useState } from "react";
import App from "./App";
import { useUserService } from "./services";
import { useToken } from "./store/reducers/auth-reducer";
import { useProfile, useSaveProfile } from "./store/reducers/user-reducer";

type ConfirmModalProps = {
  title: string;
  description: string;
  withCancelButton: boolean;
  labels: {
    confirm: string,
    cancel: string
  }
  onSubmit?: () => void;
  onClose?: () => void;
};

const ConfirmModal = ({ context, id, innerProps }: ContextModalProps<ConfirmModalProps>) => (
  <Stack spacing="sm">
    <Title order={5}>{innerProps.title}</Title>
    <Text size="sm">{innerProps.description}</Text>
    <Group position="right" spacing="xs">
      {innerProps.withCancelButton && <Button onClick={() => { context.closeModal(id); innerProps.onClose && innerProps.onClose() }}>{innerProps.labels.cancel}</Button>}
      <Button onClick={() => { context.closeModal(id); innerProps.onSubmit && innerProps.onSubmit(); }}>{innerProps.labels.confirm}</Button>
    </Group>
  </Stack>
);

type ConfirmWithInputModalProps = {
  title: string;
  description?: string;
  withCancelButton: boolean;
  labels: {
    confirm: string,
    cancel: string
  };
  textAreaPlaceholder?: string,
  confirmProps: ButtonProps;
  cancelProps: ButtonProps;
  onSubmit?: (feedback: string) => void;
  onClose?: () => void;
};

const ConfirmWithInputModal = ({ context, id, innerProps }: ContextModalProps<ConfirmWithInputModalProps>) => {
  const [feedback, setFeedback] = useState("");
  return <Stack spacing="sm">
    <Title order={4}>{innerProps.title}</Title>
    {innerProps.description && <Text size="sm">{innerProps.description}</Text>}
    <Textarea
      minRows={3}
      maxRows={10}
      autosize
      placeholder={innerProps.textAreaPlaceholder}
      required
      value={feedback}
      onChange={(event) => setFeedback(event.currentTarget.value)}
      styles={theme => ({ input: { borderRadius: theme.radius.sm } })}
    />
    <Group position="right" spacing="xs">
      {innerProps.withCancelButton && <Button {...innerProps.cancelProps} onClick={() => { context.closeModal(id); innerProps.onClose && innerProps.onClose() }}>{innerProps.labels.cancel}</Button>}
      <Button {...innerProps.confirmProps} onClick={() => { context.closeModal(id); innerProps.onSubmit && innerProps.onSubmit(feedback); }}>{innerProps.labels.confirm}</Button>
    </Group>
  </Stack>
}

export function useIsDark() {
  const { colorScheme } = useMantineColorScheme();
  return useMemo(() => colorScheme === "dark", [colorScheme]);
}

function Root() {
  const { updateCurrentUser } = useUserService();
  const profile = useProfile();
  const saveProfile = useSaveProfile();
  const token = useToken();

  const [colorScheme, setColorScheme] = useState<any>("light")

  function toggleColorScheme(value?: ColorScheme) {
    value = value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(value);
  };

  return <ColorSchemeProvider colorScheme={"light"} toggleColorScheme={toggleColorScheme}>
    <MantineProvider
      withNormalizeCSS
      withGlobalStyles
      theme={{
        colorScheme,
        colors: {
          generation: ["#95b5ff", "#80a6fe", "#6b97fe", "#5589fe", "#407afe", "#2875DF", "#2374E3", "#1D72E7", "#1571EF", "#0D70F7"],
          // red: ["#EEC8C6", "#EAB0AD", "#E89995", "#E8817C", "#DF716C", "#D6645E", "#CC5852", "#C24E48", "#B54843", "#A44742"],
        },
        primaryColor: "generation",
        // fontFamily: "Montserrat, sans-serif",
        // fontFamilyMonospace: "Monaco, Courier, monospace",
        headings: {
          // fontFamily: "Montserrat, sans-serif",
        },
        components: {
          Button: {
            styles: theme => ({
              root: {
                borderRadius: theme.radius.sm,
                paddingLeft: theme.spacing.xl,
                paddingRight: theme.spacing.xl,
                "&:enabled": { boxShadow: "none" },
                "&:before": { borderRadius: theme.radius.sm }
              }
            })
          },
          Select: {
            styles: theme => ({
              input: { borderRadius: "0.2rem" },
              dropdown: { borderRadius: "0.3rem" },
              item: { borderRadius: "0.3rem" }
            })
          },
          MultiSelect: {
            styles: theme => ({
              input: {
                borderRadius: "0.3rem",
                boxShadow: "none",
              },
              dropdown: { borderRadius: "0.3rem" },
              item: { borderRadius: "0.3rem" }
            })
          },
          PasswordInput: {
            styles: theme => ({
              input: { borderRadius: "0.3rem", boxShadow: "none" },
              error: { fontSize: theme.fontSizes.xs },
              invalid: {
                "&::placeholder": { color: theme.colors.red[2] },
              }
            })
          },
          TextInput: {
            styles: theme => ({
              input: { borderRadius: "0.2rem", boxShadow: "none" },
              error: { fontSize: theme.fontSizes.xs },
              invalid: {
                "&::placeholder": { color: theme.colors.red[2] },
              },
            })
          },
          TextArea: { styles: theme => ({ input: { boxShadow: "none" } }) },
          Title: {
            styles: theme => ({
              root: { color: "black" },
            })
          },
          Text: {
            styles: theme => ({
              root: { color: "#AAACAF" },
            })
          },
          Badge: {
            styles: theme => ({
              root: { borderRadius: "0.2rem" },
            })
          }
        }
      }}>
      {/* <Global styles={[
        {
          "@font-face": {
            fontFamily: "Montserrat",
            src: `url("Montserrat-Regular.ttf") format("truetype")`,
            fontWeight: "normal",
            fontStyle: "normal",
            fontDisplay: "swap",
          }
        },
        {
          "@font-face": {
            fontFamily: "Montserrat",
            src: `url("Montserrat-Bold.ttf") format("truetype")`,
            fontWeight: "bold",
            fontStyle: "normal",
            fontDisplay: "swap",
          }
        },
        {
          "@font-face": {
            fontFamily: "Montserrat",
            src: `url("Montserrat-Medium.ttf") format("truetype")`,
            fontWeight: "medium",
            fontStyle: "normal",
            fontDisplay: "swap"
          }
        },
        {
          "@font-face": {
            fontFamily: "Montserrat",
            src: `url("Montserrat-SemiBold.ttf") format("truetype")`,
            fontWeight: "semi-bold",
            fontStyle: "normal",
            fontDisplay: "swap"
          }
        }
      ]} /> */}
      <NotificationsProvider>
        {/* @ts-ignore */}
        <ModalsProvider
          modals={{ confirm: ConfirmModal, confirmWithInput: ConfirmWithInputModal }}
          modalProps={{ radius: "lg", withCloseButton: false, centered: true, zIndex: 200 }}
        >
          <App />
        </ModalsProvider>
      </NotificationsProvider>
    </MantineProvider>
  </ColorSchemeProvider >
}

export default Root