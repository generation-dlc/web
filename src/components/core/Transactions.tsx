import { useEffect, useState } from "react";
import { createStyles, Group, Stack, Text, Pagination, Title, Select, TextInput, Paper, Table, Badge, ActionIcon, Menu } from "@mantine/core";
import { IoIosSearch } from 'react-icons/io';
import { BsThreeDots } from 'react-icons/bs';
import { FiChevronUp, FiX } from 'react-icons/fi';
import { useProfile } from "../../store/reducers/user-reducer";
import { useTranslation } from "react-i18next";
import { Roles, Transaction, TransactionType } from "../../types";
import format from "date-fns/format";
import { firstLetterUpperCase } from "../../utils";

export default function Transactions() {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const profile = useProfile();

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [page, setPage] = useState<number>(1)

  useEffect(() => {
    setTransactions([
      {
        _id: "0",
        date: new Date().toISOString(),
        type: TransactionType.ACTION,
        description: "Entrée",
        points: 20,
        xp: 20,
        from: { firstName: "Thomas", lastName: "Dupuis", role: Roles.STAFF },
        to: { firstName: "Laure", lastName: "Vandenberg", role: Roles.USER },
        actionId: "1"
      },
      {
        _id: "1",
        date: new Date().toISOString(),
        type: TransactionType.EVENT,
        description: "Ticket - Bling King 11/07/2023",
        points: -120,
        from: { firstName: "Thomas", lastName: "Dupuis", role: Roles.STAFF },
        to: { firstName: "Laure", lastName: "Vandenberg", role: Roles.USER },
        eventId: "0"
      },
      {
        _id: "2",
        date: new Date().toISOString(),
        type: TransactionType.PRODUCT,
        description: "Bon d'achat Paint Quotidientcdskjncdsjknxs",
        points: -90,
        to: { firstName: "Laure", lastName: "Vandenberg", role: Roles.USER },
        productId: "0"
      },
    ])
  }, [])

  const rows = transactions.map((transaction) => (
    <tr key={transaction._id} style={{ position: "relative" }}>
      <td>{format(new Date(transaction.date), "dd/MM/yyyy HH:mm")}</td>
      <td><Badge size="sm" color="gray">{transaction.type}</Badge></td>
      <td>
        <Text
          sx={theme => ({
            "&:hover": {
              cursor: transaction.type !== TransactionType.ACTION ? "pointer" : ""
            }
          })}
          style={{ color: transaction.type !== TransactionType.ACTION ? "#4A96E7" : "black", textDecoration: transaction.type !== TransactionType.ACTION ? "underline" : "" }}>
          {transaction.description.substring(0, 20)}{transaction.description.length > 20 && "..."}
        </Text>
      </td>
      <td><Text style={{ color: transaction.points > 0 ? "#5FC86D" : "red" }}>
        {transaction.points > 0 ? "+" + transaction.points : transaction.points}
      </Text>
      </td>
      <td>{transaction.xp ? "+" + transaction.xp : "-"}</td>
      <td>{transaction?.from?.firstName
        ? <Stack style={{ gap: 0 }}>
          <Text style={{ color: "black" }}>{transaction.from.firstName + " " + transaction.from.lastName}</Text>
          <Text>{transaction.from.role === Roles.USER ? "Client" : firstLetterUpperCase(transaction.from.role)}</Text>
        </Stack>
        : "-"
      }</td>
      <td>
        <Stack style={{ gap: 0 }}>
          <Text style={{ color: "black" }}>{transaction.to.firstName + " " + transaction.to.lastName}</Text>
          <Text>{transaction.to.role === Roles.USER ? "Client" : firstLetterUpperCase(transaction.to.role)}</Text>
        </Stack>
      </td>
      {<Group style={{ position: "absolute", right: 10, top: 15, gap: 0 }}>
        <Menu shadow="md" offset={0} position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="transparent">
              <BsThreeDots size={12} color="black" />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item icon={<FiChevronUp size={16} />}>
              Afficher les commissions
            </Menu.Item>
            <Menu.Item icon={<FiX size={16} color="red" />}>
              <Text style={{ color: "red" }}>Annuler la transaction</Text>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>}
    </tr>
  ));

  return <div className={classes.rootContainer}>
    {/* title */}
    <Title order={2}>Transactions</Title>

    {/* filters */}
    <Group position="apart">
      <Group>
        <Select
          placeholder="Donneur d'ordre"
          data={[
            { value: 'react', label: 'React' },
            { value: 'ng', label: 'Angular' },
            { value: 'svelte', label: 'Svelte' },
            { value: 'vue', label: 'Vue' },
          ]}
        />
        <Select
          placeholder="Type de transaction"
          data={[
            { value: TransactionType.ACTION, label: firstLetterUpperCase(TransactionType.ACTION) },
            { value: TransactionType.PRODUCT, label: firstLetterUpperCase(TransactionType.PRODUCT) },
            { value: TransactionType.EVENT, label: firstLetterUpperCase(TransactionType.EVENT) },
          ]}
        />
        <Select
          placeholder="Destinataire"
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
      <TextInput placeholder="Recherche par destinataire" icon={<IoIosSearch size={14} />} />

      {/* table */}
      <Table mt={"xl"}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Libellé</th>
            <th>Points</th>
            <th>XP</th>
            <th>{"Donneur d'ordre"}</th>
            <th>Utilisateur</th>
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
  </div>
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