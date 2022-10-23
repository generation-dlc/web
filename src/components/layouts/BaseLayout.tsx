import { ActionIcon, Burger, Button, Drawer, Group, useMantineColorScheme } from "@mantine/core";
import { ComponentProps, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
import { useToken } from "../../store/reducers/auth-reducer";
import { useMediaQuery } from "@mantine/hooks";
import { useClearStore } from "../../store";
import { HiMoon, HiSun } from "react-icons/hi";
import { useIsDark } from "../../Root";

const BaseLayout = (props: ComponentProps<any>) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = useToken();
  const [opened, setOpened] = useState(false);
  const clearStore = useClearStore();

  const { toggleColorScheme } = useMantineColorScheme();
  const isDark = useIsDark();

  const isMobile = useMediaQuery("(max-width: 747px)");

  async function signOut() {
    await clearStore();
    isMobile && setOpened(false);
    navigate("/sign-in", { replace: true });
  }

  function renderButtonsSection(style?: any) {
    return <Group spacing="xs" align="center" style={style}>
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
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", maxHeight: "-webkit-fill-available" }}>
      {token && (
        <>
          {
            isMobile
              ? <div>
                <Drawer withCloseButton={false} opened={opened} onClose={() => setOpened(false)} position="right" padding="xl">
                  {renderButtonsSection()}
                </Drawer>
                <Burger
                  style={{ position: "absolute", right: 0, zIndex: 210, margin: "1rem" }}
                  opened={opened}
                  onClick={() => setOpened(o => !o)}
                />
              </div>
              : renderButtonsSection({ position: "absolute", right: 0, zIndex: 210, margin: "1rem" })

          }
        </>
      )}
      {props.children}
      <Outlet />
    </div>
  );
};

export default BaseLayout;
function toggleColorScheme(): void {
  throw new Error("Function not implemented.");
}

