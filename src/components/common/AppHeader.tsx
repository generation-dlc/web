import { ActionIcon, Button, Center, createStyles, Group, Header, Title, Menu, Avatar } from "@mantine/core";
import { GrTransaction } from "react-icons/gr";
import { FaHistory } from "react-icons/fa";
import { VscSignOut } from "react-icons/vsc";
import { HiOutlineHeart } from "react-icons/hi";
import { AiTwotoneSetting, AiOutlineMessage } from "react-icons/ai";
import { useToken } from "../../store/reducers/auth-reducer";
import { useTranslation } from "react-i18next";

export default function AppHeader() {
  const { t } = useTranslation();
  const token = useToken();

  return (
    <Header height={"9%"} p="sm" pl={0} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Center style={{ height: "100%", width: 350 }}>
        <Title>Sell For Crypto</Title>
      </Center>

      <Group spacing="xs" style={{ paddingRight: 20 }}>
        {token
          ? <Group>
            <Button variant="white" onClick={() => { }}>{t("common.signIn")}</Button>
            <Button onClick={() => { }}>{t("common.signUp")}</Button>
          </Group>
          : <Menu shadow="md" width={220} withArrow arrowOffset={0}>
            <Menu.Target>
              <ActionIcon radius="xl" variant="outline">
                <Avatar radius="xl" size="lg" />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                icon={<AiOutlineMessage size={14} />}
                rightSection={false
                  ? <div style={{ height: 10, width: 10, borderRadius: 20, backgroundColor: "red" }} />
                  : <></>
                }
              >
                {t("user.menu.messages")}
              </Menu.Item>
              <Menu.Item icon={<HiOutlineHeart size={14} />}>
                {t("user.menu.favorites")}
              </Menu.Item>
              <Menu.Item icon={<GrTransaction size={14} />}>
                {t("user.menu.track")}
              </Menu.Item>
              <Menu.Item icon={<FaHistory size={14} />}>
                {t("user.menu.history")}
              </Menu.Item>
              <Menu.Item icon={<AiTwotoneSetting size={14} />}>
                {t("user.menu.settings")}
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item color="red" icon={<VscSignOut size={14} />}>
                {t("common.signOut")}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        }
      </Group>
    </ Header>
  )
}