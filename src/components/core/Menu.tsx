import { useEffect, useRef, useState } from "react";
import { createStyles, Group, NavLink, Navbar, Title, Badge, Divider, Box, Stack, Text } from "@mantine/core";
import { FiDatabase, FiUser, FiMessageSquare, FiCheck, FiGift, FiCalendar, FiGitPullRequest } from 'react-icons/fi';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Menu() {
  const { t } = useTranslation();
  const { classes } = useStyles();

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

  useEffect(() => {
    const path = window.location.href.split("/")[window.location.href.split("/").length - 1]

    if (path === "users")
      setActive(1)
    else if (path === "inbox")
      setActive(2)
    else if (path === "transactions")
      setActive(3)
    else if (path === "products")
      setActive(4)
    else if (path === "events")
      setActive(5)
    else if (path === "settings")
      setActive(6)
  }, [])

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