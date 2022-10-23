import { useState } from "react";
import { ActionIcon, AppShell, Button, Center, createStyles, Group, Text, Header, Navbar, Input, ScrollArea, Title, Menu, Stack, NumberInput, Checkbox } from "@mantine/core";
import styled from "styled-components";
import "@szhsin/react-menu/dist/core.css";
import {
  Menu as MultipleLevelMenu,
  MenuItem as MenuItemInner,
  SubMenu as SubMenuInner
} from "@szhsin/react-menu";
import Rate from "rc-rate";
import 'rc-rate/assets/index.css';
import styles from "./styles.module.css";
import { useTranslation } from "react-i18next";
import { HiSearch, HiUser, HiOutlineHeart, HiDotsHorizontal } from "react-icons/hi";
import { AiTwotoneSetting, AiOutlineMessage, AiOutlineUnorderedList, AiFillHome } from "react-icons/ai";
import { BsFillPhoneFill } from "react-icons/bs"
import { GiClothes } from "react-icons/gi"
import { GrTransaction } from "react-icons/gr";
import { FaHistory, FaChevronRight, FaHandshake } from "react-icons/fa";
import { BiBasketball } from "react-icons/bi"
import { VscSignOut } from "react-icons/vsc";
import { Outlet, useNavigate } from "react-router-dom";
import { useClearStore } from "../../store";
import { useToken } from "../../store/reducers/auth-reducer";

const StyledRate = styled(Rate)`
  &.rc-rate {
    font-size: ${({ size }: { size: number }) => size}px;
  }
`

function UserLayout() {
  const { t } = useTranslation();
  const clearStore = useClearStore();
  const { classes } = useStyles();
  const navigate = useNavigate();
  const token = useToken();

  const [searchValue, setSearchValue] = useState<Array<string>>([])
  const [categories, setCategories] = useState<Array<any>>([
    {
      name: "Multimedia",
      childrens: [
        {
          name: "Phones"
        },
        {
          name: "PC"
        },
        {
          name: "Video Games"
        },
        {
          name: "Picture & Sound"
        }
      ]
    },
    {
      name: "Fashion",
      childrens: [
        {
          name: "Clothes"
        },
        {
          name: "Jeans"
        },
        {
          name: "Shoes"
        },
        {
          name: "Watches"
        },
        {
          name: "Baby Clothes"
        },
        {
          name: "Luxury"
        }
      ]
    },
    {
      name: "Hobbies",
      childrens: [
        {
          name: "Books"
        },
        {
          name: "Sports"
        },
        {
          name: "Music"
        },
        {
          name: "Bikes"
        },
        {
          name: "Toys"
        }
      ]
    },
    {
      name: "Home",
      childrens: [
        {
          name: "Furnitures"
        },
        {
          name: "Home Appliance"
        },
        {
          name: "Decoration"
        },
        {
          name: "DIY"
        }
      ]
    },
    {
      name: "Service Delivery"
    },
    {
      name: "Others"
    }
  ])
  const [selectedCategory, setSelectedCategory] = useState<any>(
    {
      label: t("user.search.allCategories"),
      category: t("user.search.allCategories")
    }
  )
  const [deliveryChecked, setDeliveryChecked] = useState<boolean>(false)

  async function signOut() {
    await clearStore();
    navigate("/sign-in", { replace: true });
  }

  function search() {
    console.log("search")
  }

  function getRightIcon(categoryName: string) {
    if (categoryName === t("user.search.allCategories"))
      return <AiOutlineUnorderedList />
    else if (categoryName === "Multimedia")
      return <BsFillPhoneFill />
    else if (categoryName === "Fashion")
      return <GiClothes />
    else if (categoryName === "Hobbies")
      return <BiBasketball />
    else if (categoryName === "Home")
      return <AiFillHome />
    else if (categoryName === "Service Delivery")
      return <FaHandshake />
    else
      return <HiDotsHorizontal />
  }

  const menuClassName = ({ state }: any) =>
    state === "opening"
      ? styles.menuOpening
      : state === "closing"
        ? styles.menuClosing
        : styles.menu;

  const menuItemClassName = ({ hover }: any) =>
    hover ? styles.menuItemHover : styles.menuItem;

  const submenuItemClassName = (modifiers: any) =>
    `${styles.submenuItem} ${menuItemClassName(modifiers)}`;

  const MenuItem = (props: any) => (
    <MenuItemInner
      {...props}
      className={menuItemClassName}
      onClick={() => setSelectedCategory({ category: props.categoryName, label: props.label })}
    >
      <Group>
        {props.showIcon && getRightIcon(props.categoryName)}
        <Text>{props.label}</Text>
      </Group>
    </MenuItemInner >
  );

  const SubMenu = (props: any) => (
    <SubMenuInner
      {...props}
      menuClassName={menuClassName}
      itemProps={{ className: submenuItemClassName }}
      offsetY={-7}
    />
  );

  return <AppShell
    padding="md"
    navbar={
      // filters
      <Navbar width={{ base: "23%" }} className={classes.navbar}>
        <Navbar.Section sx={{ display: "flex", flex: 1, flexDirection: "column", padding: 10 }}>
          <Stack style={{ flex: 1, gap: "2rem" }}>
            <Group position="apart">
              <Text color="grey">{t("user.search.filters")}</Text>
              <Text sx={() => ({ cursor: "pointer" })} onClick={() => console.log("clear")}>
                {t("user.search.clearAll")}
              </Text>
            </Group>

            {/* search */}
            <Stack style={{ gap: 5 }}>
              <Text>{t("user.search.search")}</Text>
              <Input
                placeholder="playstation 5"
                rightSection={<HiSearch />}
              />
            </Stack>

            {/* categories */}
            <Stack style={{ gap: 5 }}>
              <Text>{t("user.search.categories")}</Text>
              <MultipleLevelMenu
                transition
                menuClassName={menuClassName}
                align={"start"}
                viewScroll={"auto"}
                offsetY={5}
                menuButton={
                  <Button
                    leftIcon={getRightIcon(selectedCategory.category)}
                    variant="default"
                  >
                    {selectedCategory.label}
                  </Button>
                }>

                <MenuItem label={t("user.search.allCategories")} showIcon={true} categoryName={t("user.search.allCategories")} />

                {categories.map((category: any) =>
                  category.childrens
                    ? <SubMenu
                      key={category.name}
                      label={() =>
                        <Group>
                          {getRightIcon(category.name)}
                          {category.name}
                          <Group position="right" style={{ flex: 1 }}>
                            <FaChevronRight color="white" />
                          </Group>
                        </Group>
                      }
                      offsetY={-7}
                      offsetX={5}
                    >
                      {[{ name: category.name }, ...category.childrens].map((children: any, index: number) =>
                        <MenuItem key={children.name} label={children.name} showIcon={!index} categoryName={category.name} />
                      )}
                    </SubMenu>
                    : <MenuItem label={category.name} showIcon={true} categoryName={category.name} />
                )}
              </MultipleLevelMenu>
            </Stack>

            {/* price */}
            <Stack style={{ gap: 5 }}>
              <Text>Price Range ($)</Text>
              <Stack align={"center"} style={{ padding: 20, borderStyle: "solid", borderWidth: 1, borderColor: "#EBEAED", borderRadius: 10 }}>
                <Group>
                  <NumberInput label="Min." style={{ flex: 1 }} sx={() => ({ label: { color: "grey" } })} />
                  <NumberInput label="Max." style={{ flex: 1 }} sx={() => ({ label: { color: "grey" } })} />
                </Group>
                <Checkbox
                  label="Including delivery price"
                  checked={deliveryChecked}
                  onChange={(event) => setDeliveryChecked(event.currentTarget.checked)}
                  sx={() => ({ label: { color: "grey" } })}
                />
              </Stack>
            </Stack>

            {/* stars */}
            {/* <Stack style={{ gap: 5 }}>
              <Text>Seller Reliability</Text>
              <StyledRate defaultValue={0} disabled size={20} character={<i className="anticon anticon-star" />} />
            </Stack> */}
          </Stack>

          <Button>
            {t("user.search.search")}
          </Button>
        </Navbar.Section>
      </Navbar>
    }
    header={<Header height={"9%"} p="sm" pl={0} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Center style={{ height: "100%", width: 350 }}>
        <Title>Sell For Crypto</Title>
      </Center>

      <Group spacing="xs" style={{ paddingRight: 10 }}>
        {token
          ? <Group>
            <Button variant="white" onClick={() => { }}>{t("common.signIn")}</Button>
            <Button onClick={() => { }}>{t("common.signUp")}</Button>
          </Group>
          : <Menu shadow="md" width={220} withArrow arrowOffset={0}>
            <Menu.Target>
              <ActionIcon radius="xl" variant="outline" size="lg">
                <HiUser size={22} />
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
    </ Header>}
    styles={(theme) => ({
      root: { height: "100vh", overflow: "hidden" },
      body: { height: "calc(100%)" },
      main: { padding: 0, backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0] },
    })}
  >
    {/* content */}
    <ScrollArea
      sx={{ marginLeft: "23%", marginTop: "5%", height: "91%", width: "77%" }}
      styles={{
        viewport: { "& > div": { height: "100%", padding: 70 } }
      }}
    >
      <Outlet />
    </ScrollArea>
  </AppShell>
}

const useStyles = createStyles((theme) => ({
  navbar: {
    padding: theme.spacing.lg,
    height: "91%"
  }
}));

export default UserLayout
