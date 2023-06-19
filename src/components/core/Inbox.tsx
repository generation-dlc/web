import { useEffect, useState } from "react";
import { createStyles, Group, Title, Button, Paper, Grid, Stack, Text, Select, Avatar } from "@mantine/core";
import 'rc-rate/assets/index.css';
import "@szhsin/react-menu/dist/core.css";
import 'rc-rate/assets/index.css';
import { useProfile } from "../../store/reducers/user-reducer";
import { useTranslation } from "react-i18next";
import { useIsDark } from "../../Root";
import { User } from "../../types";
import { FiUser } from "react-icons/fi";

export default function Inbox() {
  const { t } = useTranslation();
  const { classes } = useStyles();

  const [conversation, setConversations] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    setConversations([])
  }, [])

  return <>
    <div className={classes.rootContainer}>
      <Group position="apart">
        {/* title */}
        <Title order={2}>Générations</Title>

        {/* new button */}
        <Button onClick={() => { }}>
          Nouveau
        </Button>
      </Group>
    </div>
  </>
}

const useStyles = createStyles(theme => ({
  rootContainer: {
    display: "flex",
    marginLeft: "35vh",
    flexDirection: "column",
    height: "100%",
    padding: 40,
    paddingTop: 20,
    gap: 20
  },
}));