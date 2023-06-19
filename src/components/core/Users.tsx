import { useEffect, useRef, useState } from "react";
import { createStyles, Group, Stack, Text, Pagination, ActionIcon, Title, Select, TextInput, Paper, Table, Badge, Avatar, Modal, Textarea, Button, Menu } from "@mantine/core";
import { IoIosSearch } from 'react-icons/io';
import { BsPencil, BsThreeDots } from 'react-icons/bs';
import { FiSend, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import { useProfile } from "../../store/reducers/user-reducer";
import { useTranslation } from "react-i18next";
import differenceInDays from 'date-fns/differenceInDays'
import { Roles, Status, User } from "../../types";
import { firstLetterUpperCase } from "../../utils";
import { format } from "date-fns";
import { useUserService } from "../../services";

export default function Users() {
  const { getUsers, updateUser } = useUserService()
  const { t } = useTranslation();
  const { classes } = useStyles();
  const profile = useProfile();

  const [users, setUsers] = useState<User[]>([])
  const [page, setPage] = useState<number>(1)
  const [showEditUserModal, setShowEditUserModal] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<User | any>()

  useEffect(() => {
    getUsers({
      error: console.error,
      success: (res) => setUsers(res)
    })
  }, [])

  const rows = users.map((user) => (
    <tr key={user._id} style={{ position: "relative" }}>
      <td>
        <Group>
          <Avatar color="gray" radius="xl">{user.firstName[0] + user.lastName[0]}</Avatar>
          <Stack style={{ gap: 0 }}>
            {user.firstName + " " + user.lastName}
            <Text>{user.role === Roles.USER ? "Client" : firstLetterUpperCase(user.role)}</Text>
          </Stack>
        </Group>
      </td>
      <td>@{user.username}</td>
      <td>{"Il y'a " + differenceInDays(new Date(), new Date(user.lastActivity)) + " jour(s)"}</td>
      <td>{(user.xp / 1000).toFixed(1)}k</td>
      <td>{user.balance} pts</td>
      <td>{user.generation?.number ? "#" + user.generation?.number : ""}</td>
      <td>
        <Badge color={user.status === Status.ON ? "blue" : "red"}>
          {user.status === Status.ON ? "actif" : "désactivé"}
        </Badge>
      </td>
      {<Group style={{ position: "absolute", right: 10, top: 15, gap: 0 }}>
        <ActionIcon variant="transparent" onClick={() => { setSelectedUser(user); setShowEditUserModal(true) }}>
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
    </tr >
  ));

  return <div className={classes.rootContainer}>
    {/* title */}
    <Title order={2}>Utilisateurs</Title>

    {/* filters */}
    <Group position="apart">
      <Group>
        <Select
          placeholder="Type d'utlisateur"
          data={[
            { value: 'react', label: 'React' },
            { value: 'ng', label: 'Angular' },
            { value: 'svelte', label: 'Svelte' },
            { value: 'vue', label: 'Vue' },
          ]}
        />
        <Select
          placeholder="ZIP"
          data={[
            { value: 'react', label: 'React' },
            { value: 'ng', label: 'Angular' },
            { value: 'svelte', label: 'Svelte' },
            { value: 'vue', label: 'Vue' },
          ]}
        />
        <Select
          placeholder="Status"
          data={[
            { value: 'react', label: 'React' },
            { value: 'ng', label: 'Angular' },
            { value: 'svelte', label: 'Svelte' },
            { value: 'vue', label: 'Vue' },
          ]}
        />
      </Group>

      <Text
        style={{ color: "#3C8CE4" }}
        sx={{
          "&:hover": {
            cursor: "pointer"
          }
        }}
        onClick={() => { }}
      >
        Exporter
      </Text>
    </Group>

    {/* body */}
    <Paper
      p="xl"
      shadow="xs"
      style={{ borderRadius: 10, borderStyle: "solid", borderWidth: 1, borderColor: "#EDF0F2", backgroundColor: "white" }}
    >
      {/* search input */}
      <TextInput placeholder="Recherche par nom" icon={<IoIosSearch size={14} />} />

      {/* table */}
      <Table mt={"xl"}>
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Identifiant</th>
            <th>Der. activité</th>
            <th>XP</th>
            <th>Solde</th>
            <th>Gén.</th>
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

    {/* edit user modal */}
    <Modal
      centered
      opened={showEditUserModal}
      onClose={() => setShowEditUserModal(false)}
      title={<Title order={4}>Fiche Utilisateur</Title>}
      withCloseButton={false}
      styles={{ modal: { minWidth: 600 }, title: { padding: 10, paddingTop: 0 }, body: { padding: 10 } }}
      overflow="outside"
    >
      <Stack align="stretch" spacing="lg" sx={{ height: "100%" }}>
        {/* close button */}
        <ActionIcon
          variant="transparent"
          style={{ position: "absolute", top: "3%", right: "3%" }}
          onClick={() => setShowEditUserModal(false)}
        >
          <FiX size={18} color="gray" />
        </ActionIcon>

        {/* first name && last name && username */}
        <Group position="apart" grow>
          <TextInput
            id="firstName"
            label="Prénom"
            onChange={(event) => setSelectedUser({ ...selectedUser, firstName: event.currentTarget.value })}
            value={selectedUser?.firstName}
          />

          <TextInput
            id="lastName"
            label="Nom"
            onChange={(event) => setSelectedUser({ ...selectedUser, lastName: event.currentTarget.value })}
            value={selectedUser?.lastName}
          />

          <TextInput
            id="username"
            label="Identifiant"
            onChange={(event) => setSelectedUser({ ...selectedUser, username: event.currentTarget.value.replace("@", "") })}
            value={"@" + selectedUser?.username}
          />
        </Group>

        {/* email && phone number */}
        <Group position="apart" grow>
          <TextInput
            id="email"
            label="Email"
            type="email"
            onChange={(event) => setSelectedUser({ ...selectedUser, email: event.currentTarget.value })}
            value={selectedUser?.email}
          />

          <TextInput
            id="phoneNumber"
            label="Téléphone"
            onChange={(event) => setSelectedUser({ ...selectedUser, phoneNumber: event.currentTarget.value })}
            value={selectedUser?.phoneNumber}
          />
        </Group>

        {/* dof && country */}
        <Group position="apart" grow>
          <TextInput
            id="dob"
            label="Date de naissance"
            type="date"
            onChange={(event) => setSelectedUser({ ...selectedUser, dob: event.currentTarget.value })}
            value={selectedUser?.dob && format(new Date(selectedUser?.dob), "yyyy-MM-dd")}
          />

          <TextInput
            id="country"
            label="Pays"
            onChange={(event) => setSelectedUser({ ...selectedUser, country: event.currentTarget.value })}
            value={selectedUser?.country}
          />
        </Group>

        {/* city && zip */}
        <Group position="apart" grow>
          <TextInput
            id="city"
            label="Ville"
            onChange={(event) => setSelectedUser({ ...selectedUser, city: event.currentTarget.value })}
            value={selectedUser?.city}
          />

          <TextInput
            id="zip"
            label="ZIP"
            onChange={(event) => setSelectedUser({ ...selectedUser, zip: event.currentTarget.value })}
            value={selectedUser?.zip}
          />
        </Group>

        {/* last connexion && inscription date */}
        <Group position="apart" grow>
          <TextInput
            id="lastActivity"
            label="Dernière activité"
            onChange={(event) => setSelectedUser({ ...selectedUser, lastActivity: event.currentTarget.value })}
            value={selectedUser?.lastActivity && format(new Date(selectedUser?.lastActivity), "dd/MM/yyyy")}
          />

          <TextInput
            id="inscriptionDate"
            label="Date d'inscription"
            onChange={(event) => setSelectedUser({ ...selectedUser, inscriptionDate: event.currentTarget.value })}
            value={selectedUser?.inscriptionDate && format(new Date(selectedUser?.inscriptionDate), "dd/MM/yyyy")}
          />
        </Group>

        {/* notes */}
        <Textarea
          placeholder="Ecrivez ici..."
          label="Notes"
          maxRows={4}
          onChange={(event) => setSelectedUser({ ...selectedUser, note: event.currentTarget.value })}
          value={selectedUser?.note}
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
            onClick={() => setShowEditUserModal(false)}
          >
            Annuler
          </Text>
          <Button
            onClick={() => {
              // TO DO: call API
              updateUser({
                error: console.error,
                success: (res) => {
                  let user = users.find(user => user._id === selectedUser._id)
                  user = { ...selectedUser }
                  console.log(user)
                  setUsers([...users])
                  setShowEditUserModal(false)
                }
              },
                selectedUser._id,
                selectedUser)
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