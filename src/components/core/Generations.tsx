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

export default function Generations() {
  const { t } = useTranslation();
  const { classes } = useStyles();

  const [generations, setGenerations] = useState<any[]>([])
  const [leaders, setLeaders] = useState<any[]>([])

  useEffect(() => {
    // TO DO call API
    setGenerations([
      {
        _id: "0",
        number: 3,
        users: [
          // level 1
          [
            {
              _id: "0",
              firstName: "Alexandre",
              lastName: "Valerion"
            }
          ],
          // level 2
          [
            {
              _id: "3",
              firstName: "Alain",
              lastName: "Franck"
            },
            {
              _id: "9",
              firstName: "Charlotte",
              lastName: "Louviaux"
            }
          ],
          // level 3
          [
            {
              _id: "8",
              firstName: "Thomas",
              lastName: "Vandenberg"
            }
          ],
        ]
      },
      {
        _id: "1",
        number: 2,
        users: [
          // level 1
          [
            {
              _id: "0",
              firstName: "Alexandre",
              lastName: "Valerion"
            }
          ],
          // level 2
          [
            {
              _id: "3",
              firstName: "Alain",
              lastName: "Franck"
            },
            {
              _id: "9",
              firstName: "Charlotte",
              lastName: "Louviaux"
            }
          ],
          // level 3
          [
            {
              _id: "8",
              firstName: "Thomas",
              lastName: "Vandenberg"
            }
          ],
        ]
      }
    ])

    setLeaders([
      {
        _id: "0",
        firstName: "Michael",
        lastName: "Keren",
        xp: 230
      },
      {
        _id: "1",
        firstName: "David-Emmanuel",
        lastName: "Gelbard",
        xp: 215
      },
      {
        _id: "2",
        firstName: "Benoit",
        lastName: "Poelvord",
        xp: 180
      },
      {
        _id: "3",
        firstName: "Marc",
        lastName: "Schumacher",
        xp: 230
      }
    ])
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
                oij
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

                <Select
                  style={{ width: "30%" }}
                  defaultValue={"previous"}
                  data={[
                    { value: "previous", label: "Mois dernier" },
                    { value: "now", label: "Ce mois" },
                  ]}
                />
              </Group>

              {/* description */}
              <Text>Ranking des utilisateurs par XP individuels gagnés</Text>

              {leaders.map((user, index) =>
                <Group key={user._id} position="apart">
                  {/* user info */}
                  <Group>
                    <Text>#{index + 1}</Text>
                    <Avatar color="gray" radius="xl">{user.firstName[0] + user.lastName[0]}</Avatar>
                    <Text style={{ color: "black" }}>{user.firstName + " " + user.lastName}</Text>
                  </Group>

                  {/* points */}
                  <Group>
                    <Text style={{ color: "black" }}>{user.xp}</Text>
                    <Group style={{ gap: 0 }}>
                      <Text>XP</Text>
                      <FiUser size={18} color="#C9CACC" />
                    </Group>
                  </Group>
                </Group>
              )}
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
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