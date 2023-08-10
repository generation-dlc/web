import { useEffect, useState } from "react";
import { createStyles, Group, Stack, Text, Pagination, ActionIcon, Title, Select, TextInput, Paper, Table, Badge, Modal, Textarea, Button, Menu, Switch, Divider } from "@mantine/core";
import { BsPencil, BsThreeDots } from 'react-icons/bs';
import { FiSend, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import { useTranslation } from "react-i18next";
import { Action, ActionStatus, ActionTypeType, OperationType } from "../../types";
import { useActionService, useGenerationsConfigService } from "../../services";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate()
  const { t } = useTranslation();
  const { classes } = useStyles();
  const { getActions, editAction, addAction, removeAction } = useActionService();
  const { getGenerationsConfig, editGenerationsConfig } = useGenerationsConfigService()

  const [actions, setActions] = useState<Action[]>([])
  // const [page, setPage] = useState<number>(1)
  const [showEditActionModal, setShowEditActionModal] = useState<boolean>(false)
  const [selectedAction, setSelectedAction] = useState<Action | any>()
  const [generationConfig, setGenerationConfig] = useState<any>([])
  const [nbLevels, setNbLevels] = useState<number>(0)
  const [saveConfigLoading, setSaveConfigLoading] = useState(false)
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<boolean>(false)

  useEffect(() => {
    getActions({
      error: console.error,
      success: (res) => setActions(res)
    })

    getGenerationsConfig({
      error: console.error,
      success: (res) => {
        setGenerationConfig(res)
        setNbLevels(Object.keys(res).length)
      }
    })
  }, [])

  const rows = actions.map((action) => (
    <tr key={action._id} style={{ position: "relative" }}>
      <td>
        <Group>
          <Text style={{ color: "black" }}>
            {action.title}
          </Text>
          {action.type === ActionTypeType.SYSTEM && <Badge color="gray">SYSTEM</Badge>}
        </Group>
      </td>
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
            editAction({
              error: console.error,
              success: (res) => setActions([...actions])
            }, action._id, action)
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
            <Menu.Item
              icon={<FiCheck size={16} />}
              onClick={() => navigate("/transactions?action=" + action._id)}
            >
              Afficher les transactions
            </Menu.Item>
            {action.type !== ActionTypeType.SYSTEM && <Menu.Item
              icon={<FiX size={16} color={"red"} />}
              onClick={() => {
                setSelectedAction(action)
                setShowDeleteConfirmationModal(true)
              }}>
              <Text style={{ color: "red" }}>
                {"Supprimer l'action"}
              </Text>
            </Menu.Item>}
          </Menu.Dropdown>
        </Menu>
      </Group>}
    </tr >
  ));


  const rowsLevels = Object.keys(generationConfig).map((level: any, index: number) =>
    <tr key={index} style={{ position: "relative" }}>
      <td><Text>Niveau #{index + 1}</Text></td>
      <td>
        {index === 0
          ? <TextInput
            size="xs"
            id="nbUsers"
            value={generationConfig[level]?.nbUsers || 0}
            onChange={(event) => {
              if (!generationConfig[level])
                generationConfig[level] = {
                  nbUsers: 0,
                  commission: 0,
                  maxAffiliatedUsers: 0
                }

              // @ts-ignore
              generationConfig[level].nbUsers = event.currentTarget.value
              setGenerationConfig({ ...generationConfig })
            }}
          />
          : "-"}
      </td>
      <td>
        <TextInput
          size="xs"
          id="maxAffiliated"
          value={generationConfig[level]?.maxAffiliatedUsers || 0}
          onChange={(event) => {
            if (!generationConfig[level])
              generationConfig[level] = {
                nbUsers: 0,
                commission: 0,
                maxAffiliatedUsers: 0
              }
            // @ts-ignore
            generationConfig[level].maxAffiliatedUsers = event.currentTarget.value
            setGenerationConfig({ ...generationConfig })
          }}
        />
      </td>
      <td>
        <TextInput
          size="xs"
          id="commission"
          value={generationConfig[level]?.commission || 0}
          onChange={(event) => {
            if (!generationConfig[level])
              generationConfig[level] = {
                nbUsers: 0,
                commission: 0,
                maxAffiliatedUsers: 0
              }
            // @ts-ignore
            generationConfig[level].commission = event.currentTarget.value
            setGenerationConfig({ ...generationConfig })
          }}
        />
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
      <Group position="apart">
        <Stack style={{ gap: 0 }}>
          <Title order={3}>Actions</Title>
          <Text>Configurez les différents moyens de gagner et dépenser des points.</Text>
        </Stack>
        <Button
          onClick={() => {
            setSelectedAction({})
            setShowEditActionModal(true)
          }}>
          Nouveau
        </Button>
      </Group>

      {/* table */}
      <Table mt={"xl"}>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Opération</th>
            <th>Points</th>
            <th>XP gagnés</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>

      {/* pagination */}
      {/* <Group position="center" mt="xl">
        <Pagination
          size="sm"
          page={page}
          onChange={setPage}
          total={10}
          withControls={false}
        />
      </Group> */}
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
        style={{ display: "flex", flexDirection: "column", height: "100%", borderRadius: 10, borderStyle: "solid", borderWidth: 1, borderColor: "#EDF0F2", backgroundColor: "white" }}
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
              value={nbLevels.toString()}
              data={Array.from(Array(10).keys()).map(i => ({ value: "" + (i + 1), label: "" + (i + 1) }))}
              onChange={(value) => {
                setNbLevels(parseInt(value as string))

                if (parseInt(value as string) < Object.keys(generationConfig).length)
                  Object.keys(generationConfig)
                    .slice(parseInt(value as string))
                    .forEach(key => delete generationConfig[key])
                else {
                  Array.from(Array(parseInt(value as string) - Object.keys(generationConfig).length).keys())
                    .map(i => generationConfig[Object.keys(generationConfig).length + i + 1] = {
                      nbUsers: 0,
                      commission: 0,
                      maxAffiliatedUsers: 0
                    })
                }

                setGenerationConfig({ ...generationConfig })
              }}
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

        <Group position="right" style={{ height: "100%" }}>
          <Button
            loading={saveConfigLoading}
            loaderPosition="center"
            onClick={() => {
              editGenerationsConfig({
                error: console.error,
                loading: (value) => setSaveConfigLoading(value),
                success: (res) => setGenerationConfig(res)
              }, generationConfig)
            }}>
            Sauvegarder
          </Button>
        </Group>
      </Paper>
    </Group>

    {/* edit action modal */}
    <Modal
      centered
      opened={showEditActionModal}
      onClose={() => setShowEditActionModal(false)}
      title={<Title order={4}>{selectedAction?._id ? selectedAction.title : "Nouvelle Action"}</Title>}
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
            label="Points"
            onChange={(event) => setSelectedAction({ ...selectedAction, points: event.currentTarget.value })}
            value={selectedAction?.points}
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
          onChange={(event) => setSelectedAction({ ...selectedAction, description: event.currentTarget.value })}
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
              console.log(selectedAction)
              if (selectedAction._id)
                editAction({
                  error: console.error,
                  success: (res) => {
                    actions[actions.map(action => action._id).indexOf(res._id)] = res
                    setActions([...actions])
                  }
                }, selectedAction._id, selectedAction)
              else
                addAction({
                  error: console.error,
                  success: (res) => setActions([...actions, res])
                }, selectedAction)

              setShowEditActionModal(false)
            }}
          >
            Sauvegarder
          </Button>
        </Group>
      </Stack>
    </Modal>

    {/* delete confirmation modal */}
    <Modal
      opened={showDeleteConfirmationModal}
      onClose={() => setShowDeleteConfirmationModal(false)}
      title={<Title order={4}>{"Etes-vous sur de vouloir supprimer l'action ?"}</Title>}
      withCloseButton={false}
      styles={{ modal: { minWidth: 600 }, title: { padding: 10, paddingTop: 0 }, body: { padding: 10 } }}
      overflow="outside"
    >
      {/* close button */}
      <ActionIcon
        variant="transparent"
        style={{ position: "absolute", top: "3%", right: "3%" }}
        onClick={() => setShowDeleteConfirmationModal(false)}
      >
        <FiX size={18} color="gray" />
      </ActionIcon>


      {/* action buttons */}
      <Group position="right" mt="xl">
        <Text
          style={{ color: "black" }}
          sx={{
            "&:hover": {
              cursor: "pointer"
            }
          }}
          onClick={() => setShowDeleteConfirmationModal(false)}
        >
          Annuler
        </Text>
        <Button
          color="red"
          onClick={() => removeAction({
            error: console.error,
            success: (res) => {
              actions.splice(actions.map(p => p._id).indexOf(res._id), 1)
              setActions([...actions])
              setShowDeleteConfirmationModal(false)
            }
          }, selectedAction._id)
          }>
          Supprimer
        </Button>
      </Group>
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