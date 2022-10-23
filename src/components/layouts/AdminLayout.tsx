import { Accordion, ActionIcon, AppShell, Button, Center, ColorSwatch, createStyles, Group, Header, Navbar, ScrollArea, Stack, Text, Title, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { HiUsers, HiCheckCircle, HiArrowCircleUp, HiSun, HiMoon, HiUserCircle } from "react-icons/hi";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useClearStore } from "../../store";
import crakotte from "../../assets/images/crakotte.png";
import { useMemo, useState } from "react";
import { useIsDark } from "../../Root";
import { useConfigService } from "../../services/config";
import { useConfig, useSaveConfig } from "../../store/reducers/config-reducer";
import { useModals } from "@mantine/modals";

function AdminLayout() {
  const isDark = useIsDark();
  const { classes } = useStyles(isDark);
  const { toggleColorScheme } = useMantineColorScheme();
  const { editConfig } = useConfigService();
  const config = useConfig();
  const saveConfig = useSaveConfig();
  const modals = useModals();
  const theme = useMantineTheme();

  const [isAccordionOpened, setIsAccordionOpened] = useState(false);

  const navigate = useNavigate();

  const { t } = useTranslation();
  const clearStore = useClearStore();

  async function signOut() {
    await clearStore();
    navigate("/sign-in", { replace: true });
  }

  function toggleMaintenanceMode() {
    editConfig({ success: res => saveConfig(res) }, { isDisabled: !config.isDisabled });
    setIsAccordionOpened(false)
  }

  return <AppShell
    padding="md"
    navbar={
      <Navbar width={{ base: 250 }} className={classes.navbar}>
        <Navbar.Section sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Text color="grey" size="xs" weight="bold" sx={{ textTransform: "uppercase" }}>{t("admin.craManagement")}</Text>
          <TabButton value="/admin/validation" icon={<HiCheckCircle size={23} />} >{t("admin.validation")}</TabButton>
          <TabButton value="/admin/submission" icon={<HiArrowCircleUp size={23} />}>{t("admin.submission")}</TabButton>
          {/* <TabButton value="/admin/invoicing" icon={<HiCurrencyDollar size={23} />}>{t("admin.invoicing")}</TabButton> */}
          <Text color="grey" size="xs" weight="bold" sx={{ textTransform: "uppercase" }}>{t("admin.management")}</Text>
          <TabButton value="/admin/customers" icon={<HiUsers size={23} />}>{t("admin.customers")}</TabButton>
          <TabButton value="/admin/users" icon={<HiUserCircle size={23} />}>{t("admin.users")}</TabButton>
        </Navbar.Section>

        <Accordion variant="separated" onChange={() => setIsAccordionOpened(!isAccordionOpened)} value={isAccordionOpened ? "maintenanceMode" : ""} radius="lg" mt="auto" classNames={{ chevron: classes.accordionChevron, item: classes.accordionItem }}>
          <Accordion.Item value="maintenanceMode">
            <Accordion.Control>
              <Stack spacing="xs">
                <Title order={6}>{t("admin.maintenanceMode")}</Title>
                <Group spacing="xs">
                  <ColorSwatch
                    size={15}
                    color={config.isDisabled ? theme.colors.green[6] : theme.colors.red[6]}
                  />
                  <Text size="sm" color={isDark ? theme.colors.gray[5] : theme.colors.gray[6]}>{config.isDisabled ? t("common.enabled") : t("common.disabled")}</Text>
                </Group>
              </Stack>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack spacing="xs">
                <Button
                  color="red"
                  variant={"filled"}
                  onClick={() => modals.openContextModal("confirm", {
                    innerProps: {
                      title: config.isDisabled ? t("admin.confirmDisableMaintenanceMode") : t("admin.confirmEnableMaintenanceMode"),
                      description: config.isDisabled ? t("admin.disableMaintenanceDescription") : t("admin.enableMaintenanceDescription"),
                      labels: { confirm: t("common.yes"), cancel: t("common.no") },
                      withCancelButton: true,
                      onSubmit: () => toggleMaintenanceMode(),
                      onClose: () => setIsAccordionOpened(false)
                    }
                  })}
                  p="xs"
                >
                  {config.isDisabled ? t("common.disable") : t("common.enable")}
                </Button>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Navbar>
    }
    header={<Header height={70} p="sm" pl={0} sx={{ position: "sticky", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Center style={{ height: "100%", width: 250 }}>
        <img src={crakotte} alt="crakotte.png" height="100%" />
      </Center>

      <Group spacing="xs" align="center">
        <ActionIcon
          variant="light"
          radius="lg"
          color={isDark ? "yellow" : "blue"}
          onClick={() => toggleColorScheme()}
          title={t("admin.toggleColorScheme")}
        >
          {isDark ? <HiSun /> : <HiMoon />}
        </ActionIcon>

        <Button onClick={signOut}>{t("common.signOut")}</Button>
      </Group>
    </Header>}
    styles={(theme) => ({
      root: { height: "100vh", overflow: "hidden" },
      body: { height: "calc(100%)" },
      main: { width: "calc(100vw - 250px)", minHeight: "calc(100vh - 70px)", height: "calc(100vh - 70px)", padding: 0, backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0] },
    })}
  >
    <ScrollArea
      sx={{ width: "100%", height: "100%" }}
      styles={{
        viewport: { "& > div": { height: "100%" } }
      }}
    >
      <Outlet />
    </ScrollArea>

    {/* Your application here */}
  </AppShell>
}

function TabButton(props: { children: any, icon: any, value: string }) {
  const { classes } = useNavbarButtonStyles();
  const { pathname } = useLocation();

  const isDark = useIsDark();

  const selected = useMemo(() => pathname === props.value, [props.value, pathname]);

  return <Button
    classNames={classes}
    variant={"default"}
    sx={theme => ({
      border: "none",
      color: selected
        ? isDark ? theme.white : theme.colors.gray[9]
        : theme.colors.gray[6],
      backgroundColor: selected ? isDark ? theme.colors.gray[9] : theme.colors.gray[2] : "transparent",
      "&:hover": {
        backgroundColor: isDark ? theme.fn.lighten(theme.colors.gray[9], 0.03) : theme.fn.darken(theme.colors.gray[3], 0.03)
      }
    })}
    color="gray"
    leftIcon={props.icon}
    to={props.value}
    component={Link}
  >
    {props.children}
  </Button>
}

const useStyles = createStyles((theme, isDark: boolean) => ({
  accordionChevron: {
    margin: 0,
    marginBottom: "auto",
    height: 21
  },
  accordionItem: {
    backgroundColor: isDark ? theme.colors.gray[9] : theme.colors.gray[1]
  },
  maintenanceContainer: {
    backgroundColor: isDark ? theme.colors.gray[9] : theme.colors.gray[2],
  },
  navbar: {
    padding: theme.spacing.lg,
    position: "sticky"
  }
}));

const useNavbarButtonStyles = createStyles((theme) => ({
  root: {
    height: 50,
    boxShadow: "none !important"
  },

  inner: {
    display: "flex",
    justifyContent: "start",
    width: "100%"
  },

  label: {
    display: "flex",
    gap: theme.spacing.sm,
    alignItems: "center"
  }
}));

export default AdminLayout
