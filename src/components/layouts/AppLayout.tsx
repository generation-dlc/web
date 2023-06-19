import { AppShell, createStyles, ScrollArea } from "@mantine/core";
import "@szhsin/react-menu/dist/core.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useClearStore } from "../../store";
import Menu from "../core/Menu";

export default function AppLayout() {
  const clearStore = useClearStore();
  const navigate = useNavigate();

  async function signOut() {
    await clearStore();
    navigate("/sign-in", { replace: true });
  }

  return <AppShell
    padding="md"
    navbar={<></>}
    styles={(theme) => ({
      root: { height: "100vh", overflow: "hidden" },
      body: { height: "calc(100%)" },
      main: { padding: 0, backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0] },
    })}
  >
    {/* content */}
    <ScrollArea
      style={{ height: "100%" }}
      styles={{
        viewport: { "& > div": { height: "100%" } }
      }}
    >
      <Menu />
      <Outlet />
    </ScrollArea>
  </AppShell>
}
