import { useEffect, useState } from "react";
import { createStyles, Group, Stack, Text, Pagination, ActionIcon, Title, Select, TextInput, Paper, Table, Badge, Modal, Textarea, Button, Menu, Switch, Divider } from "@mantine/core";
import { BsPencil, BsThreeDots } from 'react-icons/bs';
import { FiSend, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import { useProfile } from "../../store/reducers/user-reducer";
import { useTranslation } from "react-i18next";
import { Action, ActionStatus, OperationType } from "../../types";

export default function Settings() {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const profile = useProfile();

  const [actions, setActions] = useState<Action[]>([])
  const [page, setPage] = useState<number>(1)
  const [showEditActionModal, setShowEditActionModal] = useState<boolean>(false)
  const [selectedAction, setSelectedAction] = useState<Action | any>()
  const [generationConfig, setGenerationConfig] = useState<any>([])

  useEffect(() => {
    setActions([
      {
        _id: "0",
        title: "Entrée",
        operationType: OperationType.ADD,
        points: 20,
        xp: 20,
        status: ActionStatus.ENABLED
      },
      {
        _id: "1",
        title: "Bouteille",
        operationType: OperationType.REMOVE,
        points: 2000,
        xp: 100,
        status: ActionStatus.ENABLED
      },
    ])

    setGenerationConfig([
      { nbUsers: 10, maxAffiliated: 5, commission: 10 },
      { maxAffiliated: 2, commission: 7 },
      { maxAffiliated: 2, commission: 5 },
      {}
    ])
  }, [])

  const rows = actions.map((action) => (
    <tr key={action._id} style={{ position: "relative" }}>
      <td>{action.title}</td>
      <td>
        <Badge color={action.operationType === OperationType.ADD ? "blue" : "red"}>
          {action.operationType === OperationType.ADD ? "CREDIT" : "DEBIT"}
        </Badge>
      </td>
      <td>{action.points}</td>
      <td>{action.xp}</td>
      <td>
        <Switch
          checked={action.status === ActionStatus.ENABLED}
          onChange={(event) => {
            action.status = event.currentTarget.checked ? ActionStatus.ENABLED : ActionStatus.DISABLED
            setActions([...actions])
          }}
        />
      </td>
      {<Group style={{ position: "absolute", right: 10, top: 5, gap: 0 }}>
        <ActionIcon variant="transparent" onClick={() => { setSelectedAction(action); setShowEditActionModal(true) }}>
          <BsPencil size={12} color="black" />
        </ActionIcon>

        <Menu shadow="md" offset={0} position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="transparent">
              <BsThreeDots size={12} color="black" />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item icon={<FiSend size={16} />}>
              Envoyer un message
            </Menu.Item>
            <Menu.Item icon={<FiCheck size={16} />}>
              Afficher les transactions
            </Menu.Item>
            <Menu.Item icon={<FiInfo size={16} style={{ transform: "rotate(180deg)" }} />}>
              Envoyer un avertissement
            </Menu.Item>
            <Menu.Item icon={<FiX size={16} color="red" />}>
              <Text style={{ color: "red" }}>{"Bannir l'utilisateur"}</Text>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>}
    </tr>
  ));

  const rowsLevels = generationConfig.map((level: any, index: number) =>
    <tr key={index} style={{ position: "relative" }}>
      <td><Text>Niveau #{index + 1}</Text></td>
      <td>
        {level.nbUsers
          ? <TextInput
            size="xs"
            id="nbUsers"
            value={level.nbUsers}
            onChange={(event) => {
              // @ts-ignore
              level.nbUsers = event.currentTarget.value
              setGenerationConfig([...generationConfig])
            }}
          />
          : "-"}
      </td>
      <td>
        {level.maxAffiliated
          ? <TextInput
            size="xs"
            id="maxAffiliated"
            value={level.maxAffiliated}
            onChange={(event) => {
              // @ts-ignore
              level.maxAffiliated = event.currentTarget.value
              setGenerationConfig([...generationConfig])
            }}
          />
          : "-"}
      </td>
      <td>
        {level.commission
          ? <TextInput
            size="xs"
            id="commission"
            value={level.commission + "%"}
            onChange={(event) => {
              // @ts-ignore
              level.commission = event.currentTarget.value
              setGenerationConfig([...generationConfig])
            }}
          />
          : "-"}
      </td>
    </tr>
  )

  return <div className={classes.rootContainer}>
    {/* title */}
    <Title order={2}>Paramètres</Title>

    {/* body */}
    <Paper
      p="xl"
      shadow="xs"
      style={{ height: "50%", borderRadius: 10, borderStyle: "solid", borderWidth: 1, borderColor: "#EDF0F2", backgroundColor: "white" }}
    >
      {/* title */}
      <Stack style={{ gap: 0 }}>
        <Title order={3}>Actions</Title>
        <Text>Configurez les différents moyens de gagner et dépenser des points.</Text>
      </Stack>

      {/* table */}
      <Table mt={"xl"}>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Opération</th>
            <th>{"Prix (points)"}</th>
            <th>XP gagnés</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>

      {/* pagination */}
      <Group position="center" mt="xl">
        <Pagination
          size="sm"
          page={page}
          onChange={setPage}
          total={10}
          withControls={false}
        />
      </Group>
    </Paper>

    <Group style={{ height: "50%" }} grow>
      {/* notifications */}
      <Paper
        p="xl"
        shadow="xs"
        style={{ height: "100%", borderRadius: 10, borderStyle: "solid", borderWidth: 1, borderColor: "#EDF0F2", backgroundColor: "white" }}
      >
        <Stack style={{ gap: 0 }}>
          <Title order={3}>Notifications</Title>
          <Text>Configurez les notifictions emails que vous souhaitez reçevoir</Text>
        </Stack>

        <Stack mt="xl">
          {/* inbox */}
          <Stack>
            <Group position="apart">
              <Stack style={{ gap: 0 }}>
                <Text size="lg" style={{ color: "black" }}>Inbox</Text>
                <Text>{"Etre notifié pour chaque nouveau message entrant"}</Text>
              </Stack>

              <Switch size="md" />
            </Group>

            <Divider />
          </Stack>

          {/* transaction */}
          <Stack>
            <Group position="apart">
              <Stack style={{ gap: 0 }}>
                <Text size="lg" style={{ color: "black" }}>Transaction</Text>
                <Text>{"Etre notifié pour chaque nouvelle transaction"}</Text>
              </Stack>

              <Switch size="md" />
            </Group>

            <Divider />
          </Stack>

          {/* staff */}
          <Stack>
            <Group position="apart">
              <Stack style={{ gap: 0 }}>
                <Text size="lg" style={{ color: "black" }}>Staff</Text>
                <Text>{"Etre notifié pour chaque nouvelle inscription staff"}</Text>
              </Stack>

              <Switch size="md" />
            </Group>

            <Divider />
          </Stack>

          {/* user */}
          <Stack>
            <Group position="apart">
              <Stack style={{ gap: 0 }}>
                <Text size="lg" style={{ color: "black" }}>Utilisateur</Text>
                <Text>{"Etre notifié pour chaque nouvelle inscription utilisateur"}</Text>
              </Stack>

              <Switch size="md" />
            </Group>

            <Divider />
          </Stack>
        </Stack>
      </Paper>

      {/* level */}
      <Paper
        p="xl"
        shadow="xs"
        style={{ height: "100%", borderRadius: 10, borderStyle: "solid", borderWidth: 1, borderColor: "#EDF0F2", backgroundColor: "white" }}
      >
        {/* header */}
        <Group position="apart">
          <Stack style={{ gap: 0 }}>
            <Title order={3}>Niveaux</Title>
            <Text>Configurez le schéma de générations</Text>
          </Stack>

          <Stack align="center" style={{ width: "11%", gap: 0 }}>
            <Text size="sm" style={{ color: "black" }}># Niveaux</Text>
            <Select
              defaultValue={"4"}
              data={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4", label: "4" },
              ]}
            />
          </Stack>
        </Group>

        {/* table */}
        <Table mt={"xl"}>
          <thead>
            <tr>
              <th>Niveau</th>
              <th># Générateur</th>
              <th># Max. Affiliés</th>
              <th>Commission</th>
            </tr>
          </thead>
          <tbody>{rowsLevels}</tbody>
        </Table>
      </Paper>
    </Group>

    {/* edit user modal */}
    <Modal
      centered
      opened={showEditActionModal}
      onClose={() => setShowEditActionModal(false)}
      title={<Title order={4}>Nouvelle Action</Title>}
      withCloseButton={false}
      styles={{ modal: { minWidth: 600 }, title: { padding: 10, paddingTop: 0 }, body: { padding: 10 } }}
      overflow="outside"
    >
      <Stack align="stretch" spacing="lg" sx={{ height: "100%" }}>
        {/* close button */}
        <ActionIcon
          variant="transparent"
          style={{ position: "absolute", top: "3%", right: "3%" }}
          onClick={() => setShowEditActionModal(false)}
        >
          <FiX size={18} color="gray" />
        </ActionIcon>

        {/* title */}
        <TextInput
          required
          id="title"
          label="Titre"
          onChange={(event) => setSelectedAction({ ...selectedAction, title: event.currentTarget.value })}
          value={selectedAction?.title}
        />

        {/* type && price && xp */}
        <Group position="apart" grow>
          <Select
            required
            label="Type d'opération"
            data={[
              { value: OperationType.ADD, label: "Crédit" },
              { value: OperationType.REMOVE, label: "Débit" }
            ]}
            value={selectedAction?.operationType}
            onChange={(value) => setSelectedAction({ ...selectedAction, operationType: value })}
          />

          <TextInput
            required
            id="price"
            label="Prix"
            onChange={(event) => setSelectedAction({ ...selectedAction, price: event.currentTarget.value })}
            value={selectedAction?.price}
          />

          <TextInput
            id="xp"
            label="XP"
            onChange={(event) => setSelectedAction({ ...selectedAction, xp: event.currentTarget.value })}
            value={selectedAction?.xp}
          />
        </Group>

        {/* notes */}
        <Textarea
          placeholder="Ecrivez ici..."
          label="Description"
          maxRows={4}
          onChange={(event) => selectedAction({ ...selectedAction, description: event.currentTarget.value })}
          value={selectedAction?.description}
        />

        {/* action buttons */}
        <Group position="right">
          <Text
            style={{ color: "black" }}
            sx={{
              "&:hover": {
                cursor: "pointer"
              }
            }}
            onClick={() => setShowEditActionModal(false)}
          >
            Annuler
          </Text>
          <Button
            onClick={() => {
              // TO DO: call API
              setShowEditActionModal(false)
            }}
          >
            Sauvegarder
          </Button>
        </Group>
      </Stack>
    </Modal>
  </div >
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