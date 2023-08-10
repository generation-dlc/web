import { useEffect, useState } from "react";
import { createStyles, Group, Title, Button, Paper, Grid, Stack, Text, Avatar, Accordion, Modal, MultiSelect } from "@mantine/core";
import 'rc-rate/assets/index.css';
import "@szhsin/react-menu/dist/core.css";
import 'rc-rate/assets/index.css';
import { useTranslation } from "react-i18next";
import { User } from "../../types";
import { FiUser, FiPlus, FiX } from "react-icons/fi";
import { IoIosGitNetwork } from "react-icons/io";
import { useGenerationService, useServiceService } from "../../services";

export default function Generations() {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const { getGenerations, getLeaderboard } = useGenerationService()
  const { sendEmails } = useServiceService()

  const [generations, setGenerations] = useState<any[]>([])
  const [leaders, setLeaders] = useState<any[]>([])
  const [showCreatGenerationModal, setShowCreatGenerationModal] = useState<boolean>(false)
  const [emails, setEmails] = useState<any[]>([])

  useEffect(() => {
    getGenerations({
      error: console.error,
      success: (res) => setGenerations(res)
    })

    getLeaderboard({
      error: console.error,
      success: (res) => setLeaders(res)
    })
  }, [])

  return <>
    <div className={classes.rootContainer}>
      <Group position="apart">
        {/* title */}
        <Title order={2}>Générations</Title>

        {/* new button */}
        <Button onClick={() => setShowCreatGenerationModal(true)}>
          Nouveau
        </Button>
      </Group>

      <Grid style={{ width: "100%" }}>
        {/* generation list */}
        <Grid.Col span={8}>
          <Stack>
            {generations.map(generation =>
              <Paper
                key={generation._id}
                p="xl"
                shadow="xs"
                style={{ borderRadius: 10, borderStyle: "solid", borderWidth: 1, borderColor: "#EDF0F2", backgroundColor: "white" }}
              >
                <Accordion
                  variant="filled"
                  chevronPosition="left"
                  defaultValue={generation.users.filter((u: User) => u.affiliatedUsers.length).map((u: User) => u._id)}
                >
                  <Item user={generation.users[0] as any} generations={generations} />
                </Accordion>
              </Paper>
            )}
          </Stack>
        </Grid.Col>

        {/* leaderboard */}
        <Grid.Col span={"auto"}>
          <Paper
            p="xl"
            shadow="xs"
            style={{ minHeight: 500, borderRadius: 10, borderStyle: "solid", borderWidth: 1, borderColor: "#EDF0F2", backgroundColor: "white" }}
          >
            <Stack>
              <Group position="apart">
                <Title order={3}>Leaderboard</Title>

                {/* <Select
                  style={{ width: "30%" }}
                  defaultValue={"previous"}
                  data={[
                    { value: "previous", label: "Mois dernier" },
                    { value: "now", label: "Ce mois" },
                  ]}
                /> */}
              </Group>

              {/* description */}
              <Text>Ranking des utilisateurs par XP individuels gagnés</Text>

              {leaders.map((user, index) =>
                <Group key={user._id} position="apart">
                  {/* user info */}
                  <Group style={{ width: "70%" }}>
                    <Text>#{index + 1}</Text>
                    <Avatar color="dark" radius="xl">{user.firstName[0] + user.lastName[0]}</Avatar>

                    <Text
                      style={{
                        width: "55%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "black"
                      }}>
                      {user.firstName + " " + user.lastName}
                    </Text>
                  </Group>

                  {/* points */}
                  <Group spacing="xs">
                    <Text style={{ color: "black" }}>{user.xp}</Text>
                    <Group style={{ gap: 0 }}>
                      <Text>XP</Text>
                      <FiUser size={16} color="#C9CACC" />
                    </Group>
                  </Group>
                </Group>
              )}
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* create/edit event modal */}
      <Modal
        centered
        opened={showCreatGenerationModal}
        onClose={() => setShowCreatGenerationModal(false)}
        title={<Title order={4}>Fiche Génération</Title>}
        withCloseButton={false}
        styles={{ modal: { minWidth: 600 }, title: { padding: 10, paddingTop: 0 }, body: { padding: 10 } }}
        overflow="outside"
      >
        <MultiSelect
          data={emails}
          placeholder="Ajouter les adresses email des générateurs"
          searchable
          creatable
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            const item = { value: query, label: query };
            setEmails([...emails, item]);
            return item;
          }}
        />

        {/* new button */}
        <Group position="right" mt="lg">
          <Text
            style={{ color: "black" }}
            sx={{
              "&:hover": {
                cursor: "pointer"
              }
            }}
            onClick={() => setShowCreatGenerationModal(false)}>
            Annuler
          </Text>

          <Button onClick={() => emails.length && sendEmails({
            error: console.error,
            success: (res) => setShowCreatGenerationModal(false)
          }, { emails: emails.map((obj) => obj.value) })}>
            Créer
          </Button>
        </Group>
      </Modal>
    </div>
  </>
}

function calculXp(user: User, generations: any): number {
  if (!user)
    return 0

  return user
    .affiliatedUsers
    .map((affiliatedUserId: string) => {
      const u = generations
        .find((g: any) => g._id === user.generation)?.users.find((u: User) => u._id === affiliatedUserId)
      return calculXp(u, generations) + (u?.xp || 0)
    })
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
}

const Item = ({ user, generations }: { user: User, generations: any }) => {
  const [close, setClose] = useState(true)

  return user
    ? <Accordion.Item value={user._id}>
      {/* info */}
      <Accordion.Control
        chevron={close ? <FiX size={16} /> : <FiPlus size={20} />}
        onClick={() => setClose(!close)}
      >
        <Group position="apart">
          <Group>
            <Avatar color="blue" radius="sm" size="lg">
              <Text style={{ color: "black" }}>
                {user.firstName[0] + user.lastName[0]}
              </Text>
            </Avatar>
            <Stack style={{ gap: 0 }}>
              <Text style={{ color: "black" }}>{user.firstName + " " + user.lastName}</Text>
              <Text size="sm">Niveau {user.level}</Text>
            </Stack>
          </Group>

          <Group style={{ gap: 60 }}>
            <Stack align="center" style={{ gap: 0 }}>
              <Text weight="bold" style={{ color: "black" }}>{user.affiliatedUsers.length}</Text>
              <Text size="sm">Affiliés</Text>
            </Stack>

            <Stack align="center" style={{ gap: 0 }}>
              <Text weight="bold" style={{ color: "black" }}>{user.xp}</Text>
              <Group style={{ gap: 0 }}>
                <Text size="sm">XP</Text>
                <FiUser size={14} color="#C9CACC" />
              </Group>
            </Stack>

            <Stack align="center" style={{ gap: 0 }}>
              <Text weight="bold" style={{ color: "black" }}>
                {calculXp(user, generations)}
              </Text>
              <Group style={{ gap: 0 }}>
                <Text size="sm">XP</Text>
                <IoIosGitNetwork size={14} color="#C9CACC" style={{ transform: "rotate(180deg)" }} />
              </Group>
            </Stack>
          </Group>
        </Group>
      </Accordion.Control>

      {/* next users */}
      <Accordion.Panel>
        {user.affiliatedUsers.map(id => <div key={id as any}>
          {/* @ts-ignore */}
          <Item user={generations?.find(generation => generation._id === user.generation).users.find((u: User) => u._id === id)} generations={generations} />
        </div>)}
      </Accordion.Panel>
    </Accordion.Item>
    : <></>
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