import { useEffect, useRef, useState } from "react";
import { createStyles, Group, Stack, Text, Pagination, ActionIcon, Title, Select, TextInput, Paper, Table, Badge, Avatar, Modal, Textarea, Button, Menu, Loader, Center } from "@mantine/core";
import { IoIosSearch } from 'react-icons/io';
import { BsPencil, BsThreeDots } from 'react-icons/bs';
import { FiSend, FiCheck, FiX, FiUser, FiInfo } from 'react-icons/fi';
import { useTranslation } from "react-i18next";
import differenceInDays from 'date-fns/differenceInDays'
import { UserRoles, UserStatus, User } from "../../types";
import { firstLetterUpperCase } from "../../utils";
import { format } from "date-fns";
import { useUserService } from "../../services";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const navigate = useNavigate()
  const { getUsersByProperty, updateUser } = useUserService()
  const { t } = useTranslation();
  const { classes } = useStyles();

  const [loading, setLoading] = useState<boolean>(true)
  const [users, setUsers] = useState<User[]>([])
  const [searchText, setSearchText] = useState<string>("")
  const [userRole, setUserRole] = useState<string>("")
  const [userStatus, setUserStatus] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [showEditUserModal, setShowEditUserModal] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<User | any>()

  useEffect(() => {
    getUsersByProperty({
      error: console.error,
      loading: (value) => setLoading(value),
      success: (res) => {
        setUsers(res.users)
        setTotalPages(Math.ceil(res.count / 20))
      }
    }, {
      text: searchText,
      ...(userRole && { role: userRole }),
      ...(userStatus && { status: userStatus })
    }, { page: page - 1 })
  }, [page, searchText, userRole, userStatus])

  const rows = users.map((user) => (
    <tr key={user._id} style={{ position: "relative" }}>
      <td>
        <Group>
          <Avatar color="dark" radius="xl">{user.firstName[0] + user.lastName[0]}</Avatar>
          <Stack style={{ gap: 0 }}>
            {user.firstName + " " + user.lastName}
            <Text>{user.role === UserRoles.USER ? "Client" : firstLetterUpperCase(user.role)}</Text>
          </Stack>
        </Group>
      </td>
      <td>@{user.username}</td>
      <td>{"Il y'a " + differenceInDays(new Date(), new Date(user.lastActivity)) + " jour(s)"}</td>
      <td>{(user.xp / 1000).toFixed(1)}k</td>
      <td>{user.balance} pts</td>
      <td>{user.role === UserRoles.USER && "#" + user.level}</td>
      <td>
        <Badge color={user.status === UserStatus.ON ? "blue" : "red"}>
          {user.status === UserStatus.ON ? "actif" : "désactivé"}
        </Badge>
      </td>
      {<Group style={{ position: "absolute", right: 10, top: 15, gap: 0 }}>
        <ActionIcon variant="transparent" onClick={() => { setSelectedUser(user); setShowEditUserModal(true) }}>
          <BsPencil size={12} color="black" />
        </ActionIcon>

        <Menu shadow="md" offset={0}>
          <Menu.Target>
            <ActionIcon variant="transparent">
              <BsThreeDots size={12} color="black" />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              icon={<FiSend size={16} />}
              onClick={() => navigate("/inbox", { state: { ...user } })}
            >
              Envoyer un message
            </Menu.Item>
            <Menu.Item
              icon={<FiCheck size={16} />}
              onClick={() => navigate("/transactions?to=" + user._id)}
            >
              Afficher les transactions
            </Menu.Item>
            <Menu.Item icon={<FiInfo size={16} style={{ transform: "rotate(180deg)" }} />}>
              Envoyer un avertissement
            </Menu.Item>
            <Menu.Item
              icon={user.status === UserStatus.ON
                ? <FiX size={16} color={"red"} />
                : <FiUser size={16} color={"blue"} />
              }
              onClick={() => updateUser({
                error: console.error,
                success: (res) => {
                  user.status = user.status === UserStatus.ON ? UserStatus.BAN : UserStatus.ON
                  setUsers([...users])
                }
              }, user._id, { ...user, status: user.status === UserStatus.ON ? UserStatus.BAN : UserStatus.ON })}
            >
              <Text style={{ color: user.status === UserStatus.ON ? "red" : "blue" }}>
                {user.status === UserStatus.ON
                  ? "Bannir l'utilisateur"
                  : "Activiter l'utilisateur"
                }
              </Text>
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
            { value: "", label: "Type d'utlisateur" },
            { value: UserRoles.ADMIN, label: firstLetterUpperCase(UserRoles.ADMIN) },
            { value: UserRoles.STAFF, label: firstLetterUpperCase(UserRoles.STAFF) },
            { value: UserRoles.BOUNCER, label: "Videur" },
            { value: UserRoles.CASHIER, label: "Caissier" },
            { value: UserRoles.USER, label: "Utilisateur" }
          ]}
          onChange={(value) => setUserRole(value as string)}
        />
        <Select
          placeholder="Status"
          data={[
            { value: "", label: "Status" },
            { value: UserStatus.ON, label: "Actif" },
            { value: UserStatus.OFF, label: "Désactivé" },
            { value: UserStatus.BAN, label: "Banni" }
          ]}
          onChange={(value) => setUserStatus(value as string)}
        />
      </Group>

      {/* <Text
        style={{ color: "#3C8CE4" }}
        sx={{
          "&:hover": {
            cursor: "pointer"
          }
        }}
        onClick={() => { }}
      >
        Exporter
      </Text> */}
    </Group>

    {/* body */}
    <Paper
      p="xl"
      shadow="xs"
      style={{ borderRadius: 10, borderStyle: "solid", borderWidth: 1, borderColor: "#EDF0F2", backgroundColor: "white" }}
    >
      {/* search input */}
      <TextInput
        placeholder="Recherche par identifiant, nom ou prénom"
        icon={<IoIosSearch size={14} />}
        onChange={(event) => setSearchText(event.currentTarget.value)}
      />

      {/* table */}
      {loading
        ? <Center m="xl">
          <Loader />
        </Center>
        : <Table mt={"xl"}>
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Identifiant</th>
              <th>Der. activité</th>
              <th>XP</th>
              <th>Solde</th>
              <th>Gén.</th>
              <th style={{ width: "15%" }}>Status</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>}

      {/* pagination */}
      <Group position="center" mt="xl">
        <Pagination
          size="sm"
          page={page}
          onChange={setPage}
          total={totalPages}
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
              updateUser({
                error: console.error,
                success: (res) => {
                  users[users.map(user => user._id).indexOf(selectedUser._id)] = selectedUser
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