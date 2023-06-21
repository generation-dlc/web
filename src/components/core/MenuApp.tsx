import { useEffect, useRef, useState } from "react";
import { createStyles, Group, NavLink, Navbar, Title, Badge, Divider, Box, Stack, Text, Menu, Avatar } from "@mantine/core";
import { FiDatabase, FiUser, FiMessageSquare, FiCheck, FiGift, FiCalendar, FiGitPullRequest, FiChevronRight, FiX } from 'react-icons/fi';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useProfile } from "../../store/reducers/user-reducer";
import { useClearStore } from "../../store";

export default function MenuApp() {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const profile = useProfile();
  const clearStore = useClearStore();

  const menuLinks = useRef([
    { id: 0, label: "Generations", icon: <FiDatabase size={16} color="#3E90E6" />, path: "/generations" },
    { id: 1, label: "Utilisateurs", icon: <FiUser size={16} color="#3E90E6" />, path: "/users" },
    { id: 2, label: "Inbox", icon: <FiMessageSquare size={16} color="#3E90E6" />, path: "/inbox" },
    { id: 3, label: "Transactions", icon: <FiCheck size={16} color="#3E90E6" />, path: "/transactions" },
    { id: 4, label: "Récompenses", icon: <FiGift size={16} color="#3E90E6" />, path: "/products" },
    { id: 5, label: "Events", icon: <FiCalendar size={16} color="#3E90E6" />, path: "/events" },
    { id: 6, label: "Paramètres", icon: <FiGitPullRequest size={16} color="#B3B8BD" />, path: "/settings" }
  ])
  const [active, setActive] = useState<number>(0)
  const path = window.location.href.split("/")[window.location.href.split("/").length - 1]

  useEffect(() => {
    if (path.includes("users"))
      setActive(1)
    else if (path.includes("inbox"))
      setActive(2)
    else if (path.includes("transactions"))
      setActive(3)
    else if (path.includes("products"))
      setActive(4)
    else if (path.includes("events"))
      setActive(5)
    else if (path.includes("settings"))
      setActive(6)
  }, [path])

  return (
    <Navbar width={{ base: "35vh" }} className={classes.navbar}>
      <Navbar.Section className={classes.navbarSection}>
        <Group position="apart">
          <Title size={20}>Generation</Title>
          <Badge
            color="gray"
            radius="xs"
            styles={theme => ({
              inner: { fontWeight: "bold", color: "black", textTransform: "lowercase" },
            })}>
            v0.1
          </Badge>
        </Group>
      </Navbar.Section>

      <Navbar.Section style={{ width: "95%" }}>
        <Divider color="#F1F3F5" />
      </Navbar.Section>

      <Navbar.Section sx={{ display: "flex", flex: 1, flexDirection: "column" }}>
        <Box sx={{ width: "100%" }}>
          {menuLinks.current.map((item, index) =>
            <NavLink
              key={item.id}
              active={index === active}
              color="gray"
              label={item.label}
              p={10}
              pl={20}
              styles={theme => ({
                label: { marginLeft: 10, fontSize: "1rem", color: "black" },
              })}
              icon={
                <Stack style={{ padding: 7, borderRadius: 5, backgroundColor: index !== menuLinks.current.length - 1 ? "#E1F3FF" : "#F6F7F9" }}>
                  {item.icon}
                </Stack>
              }
              onClick={() => setActive(index)}
              component={Link}
              to={item.path}
            />)}
        </Box>
      </Navbar.Section>

      <Navbar.Section style={{ margin: 20 }}>
        <Menu shadow="md" offset={0} position="top" width={"100%"}>
          <Menu.Target>
            <Group
              position="apart"
              sx={{
                "&:hover": {
                  cursor: "pointer"
                }
              }}
            >
              <Group>
                <Avatar color="dark" radius="xl">{profile.firstName[0] + profile.lastName[0]}</Avatar>

                <Stack style={{ gap: 0 }}>
                  <Text style={{ color: "black" }}>
                    {profile.firstName + " " + profile.lastName}
                  </Text>

                  <Text>{profile.email}</Text>
                </Stack>
              </Group>

              <FiChevronRight size={20} color="gray" />
            </Group>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              icon={<FiX size={16} color={"gray"} />}
              onClick={() => clearStore()}
            >
              Se déconnecter
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Navbar.Section>
    </Navbar>
  )
}

const useStyles = createStyles(theme => ({
  navbar: {
    height: "100%"
  },
  navbarSection: {
    padding: theme.spacing.xl,
    paddingLeft: "2%",
    paddingRight: "10%"
  },
  rootContainer: {
    marginLeft: "35vh",
    flexDirection: "column",
    gap: 30,
    height: "100%",
    padding: 50,
    paddingTop: "7%",
  },
}));