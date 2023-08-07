import { useEffect, useRef, useState } from "react";
import { createStyles, Group, Stack, Text, Pagination, Title, Select, TextInput, Paper, Table, Badge, ActionIcon, Menu, Modal, Center, Loader } from "@mantine/core";
import { IoIosSearch } from 'react-icons/io';
import { BsThreeDots } from 'react-icons/bs';
import { FiChevronUp, FiX } from 'react-icons/fi';
import { useTranslation } from "react-i18next";
import { Transaction, TransactionType, UserRoles } from "../../types";
import format from "date-fns/format";
import { firstLetterUpperCase } from "../../utils";
import { useTransactionService } from "../../services/transaction";

export default function Transactions() {
  const { t } = useTranslation();
  const { classes } = useStyles();
  // const { getUsers } = useUserService()
  const { getTransactionsByProperty, getTransactionCommission } = useTransactionService()

  // const [staffs, setStaffs] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchText, setSearchText] = useState<string>("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transactionType, setTransactionType] = useState<string>()
  const [transactionFrom, setTransactionFrom] = useState<string>()
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [showTransactionCommissionModal, setShowTransactionCommissionModal] = useState<boolean>(false)
  const [rowsTransactionCommission, setRowsTransactionCommission] = useState([])

  const [query, setQuery] = useState(window.location.href.split("?").length > 1 && window.location.href.split("?")[1].split("="))

  useEffect(() => {
    const obj: any = {}
    if (query)
      for (let i = 0; i < query.length; i++) {
        obj[query[i]] = query[i + 1]
        i++
      }

    getTransactionsByProperty({
      error: console.error,
      loading: (value) => setLoading(value),
      success: (res) => {
        setTransactions(res.transactions)
        setTotalPages(Math.ceil(res.count / 20))
      }
    }, {
      simple: true,
      text: searchText,
      ...(transactionType && { type: transactionType }),
      ...(transactionFrom && { from: transactionFrom }),
    }, { page: page - 1, ...obj })
  }, [query, page, searchText, transactionType, transactionFrom])

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
          <Text>{transaction.from.role === UserRoles.USER ? "Client" : firstLetterUpperCase(transaction.from.role)}</Text>
        </Stack>
        : "-"
      }</td>
      <td>
        <Stack style={{ gap: 0 }}>
          <Text style={{ color: "black" }}>{transaction.to.firstName + " " + transaction.to.lastName}</Text>
          <Text>{transaction.to.role === UserRoles.USER ? "Client" : firstLetterUpperCase(transaction.to.role)}</Text>
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
            <Menu.Item
              icon={<FiChevronUp
                size={16} />}
              onClick={() => getTransactionCommission({
                error: console.error,
                success: (res) => {
                  setRowsTransactionCommission(res.map((commission: Transaction) => (
                    <tr key={commission._id} style={{ position: "relative" }}>
                      <td>{format(new Date(commission.date), "dd/MM/yyyy HH:mm")}</td>
                      <td><Text style={{ color: commission.points > 0 ? "#5FC86D" : "red" }}>
                        {commission.points > 0 ? "+" + commission.points : commission.points}
                      </Text>
                      </td>
                      <td>{commission.xp ? "+" + commission.xp : "-"}</td>
                      <td>
                        <Stack style={{ gap: 0 }}>
                          <Text style={{ color: "black" }}>{commission.to.firstName + " " + commission.to.lastName}</Text>
                          <Text>{commission.to.role === UserRoles.USER ? "Client" : firstLetterUpperCase(commission.to.role)}</Text>
                        </Stack>
                      </td>
                      {<Group style={{ position: "absolute", right: 10, top: 15, gap: 0 }}>
                        <ActionIcon variant="transparent">
                          <BsThreeDots size={12} color="black" />
                        </ActionIcon>
                      </Group>}
                    </tr>
                  )))
                  setShowTransactionCommissionModal(true)
                }
              }, transaction._id)
              }>
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
          placeholder="Type de transaction"
          data={[
            { value: "", label: "Type de transaction" },
            { value: TransactionType.ACTION, label: firstLetterUpperCase(TransactionType.ACTION) },
            { value: TransactionType.PRODUCT, label: firstLetterUpperCase(TransactionType.PRODUCT) },
            { value: TransactionType.EVENT, label: firstLetterUpperCase(TransactionType.EVENT) },
          ]}
          onChange={(value) => setTransactionType(value as string)}
        />
        {/* <Select
          placeholder="Donneur d'ordre"
          data={(() => {
            const lsStaffs = staffs.map(staff => ({ value: staff._id, label: staff.firstName + " " + staff.lastName }))
            return [{ value: "", label: "Donneur d'ordre" }, ...lsStaffs]
          })()}
          onChange={(value) => setTransactionFrom(value as string)}
        /> */}
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
      <TextInput
        placeholder="Recherche par destinataire, donneur d'ordre ou libellé"
        icon={<IoIosSearch size={14} />}
        onChange={(event) => setSearchText(event.currentTarget.value.toLowerCase())}
      />

      {/* table */}
      {loading
        ? <Center m="xl">
          <Loader />
        </Center>
        : <Table mt={"xl"}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Libellé</th>
              <th>Points</th>
              <th>XP</th>
              <th>{"Donneur d'ordre"}</th>
              <th>Destinataire</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      }

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

    {/* commission modal */}
    <Modal
      opened={showTransactionCommissionModal}
      onClose={() => setShowTransactionCommissionModal(false)}
      title={<Title order={4}>{"Commssions"}</Title>}
      withCloseButton={false}
      styles={{ modal: { minWidth: 600 }, title: { padding: 10, paddingTop: 0 }, body: { padding: 10 } }}
      overflow="outside"
      centered
    >
      {/* table */}
      <Table mt={"xl"}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Points</th>
            <th>XP</th>
            <th>Utilisateur</th>
          </tr>
        </thead>
        <tbody>{rowsTransactionCommission}</tbody>
      </Table>
    </Modal>
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