import { useEffect, useRef, useState } from "react";
import { createStyles, Group, Stack, Text, Pagination, ActionIcon, Title, Select, TextInput, Image, Paper, Table, Badge, Avatar, Modal, Button, Textarea, Tabs, Grid } from "@mantine/core";
import { IoIosSearch } from 'react-icons/io';
import { BsPencil, BsThreeDots } from 'react-icons/bs';
import { useProfile } from "../../store/reducers/user-reducer";
import { useTranslation } from "react-i18next";
import { DateRangePicker } from '@mantine/dates';
import { Gift, GiftStatus, GiftType, UserRoles, Transaction, TransactionType } from "../../types";
import format from "date-fns/format";
import { firstLetterUpperCase } from "../../utils";
import { FiX } from "react-icons/fi";
import axios from "axios"

export default function Gifts() {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const profile = useProfile();

  const transactions: any = useRef([
    {
      _id: "0",
      date: new Date().toISOString(),
      type: TransactionType.ACTION,
      description: "Entrée",
      point: 20,
      xp: 20,
      from: { _id: "0", firstName: "Thomas", lastName: "Dupuis", role: UserRoles.STAFF },
      to: { _id: "1", firstName: "Laure", lastName: "Vandenberg", role: UserRoles.USER },
      actionId: "0"
    },
    {
      _id: "1",
      date: new Date().toISOString(),
      type: TransactionType.EVENT,
      description: "Ticket - Bling King 11/07/2023",
      point: -120,
      from: { _id: "0", firstName: "Thomas", lastName: "Dupuis", role: UserRoles.STAFF },
      to: { _id: "1", firstName: "Laure", lastName: "Vandenberg", role: UserRoles.USER },
      eventId: "0"
    },
    {
      _id: "2",
      date: new Date().toISOString(),
      type: TransactionType.PRODUCT,
      description: "Bon d'achat Paint Quotidientcdskjncdsjknxs",
      point: -90,
      to: { _id: "1", firstName: "Laure", lastName: "Vandenberg", role: UserRoles.USER },
      productId: "0"
    }
  ])

  const [gifts, setGifts] = useState<Gift[]>([])
  const [page, setPage] = useState<number>(1)
  const [showEditGiftModal, setShowEditGiftModal] = useState<Gift | any>()
  const [selectedGift, setSelectedGift] = useState<Gift | any>()
  const [rowsTransaction, setRowsTransaction] = useState([])

  useEffect(() => {
    setGifts([
      {
        _id: "0",
        type: GiftType.GOODBUY,
        title: "1 Croissant",
        sponsor: "Le Pain Quotidien",
        price: 90,
        start: new Date("1999-07-26").toISOString(),
        end: new Date().toISOString(),
        used: 1,
        stock: 2,
        status: GiftStatus.ON,
        imageUrl: "data:image/jpeg;base64,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",
        description: "Petite description"
      },
      {
        _id: "1",
        type: GiftType.GOODBUY,
        title: "Captème Circuit",
        sponsor: "Spa Francorchamps",
        price: 8500,
        start: new Date().toISOString(),
        end: new Date().toISOString(),
        used: 2,
        stock: 2,
        status: GiftStatus.DRAFT,
        imageUrl: "https://hips.hearstapps.com/hmg-prod/images/2023-mclaren-artura-101-1655218102.jpg?crop=1.00xw:0.847xh;0,0.153xh&resize=1200:*"
      },
    ])
  }, [])

  const rows = gifts.map((gift) => (
    <tr key={gift._id} style={{ position: "relative" }}>
      <td>
        <Group>
          <Image
            radius="xs"
            width={80}
            src={gift.imageUrl}
            alt={gift.imageUrl}
          />
          <Stack style={{ gap: 0 }}>
            <Text style={{ color: "black" }}>
              {gift.title}
            </Text>
            <Text>
              {gift.type === GiftType.GOODBUY ? "Bon d'achat" : "Offre"}
            </Text>
          </Stack>
        </Group>
      </td>
      <td>{gift.sponsor}</td>
      <td>{gift.price}</td>
      <td>{gift?.xp || "-"}</td>
      <td>{format(new Date(gift.start), "dd/MM/yyyy") + " - " + format(new Date(gift.end), "dd/MM/yyyy")}</td>
      <td>{gift.used}/{gift.stock}</td>
      <td>
        <Badge
          size="sm"
          color={gift.status === GiftStatus.ON ? "blue" : "gray"}>
          {gift.status === GiftStatus.ON ? "ACTIF" : "BROUILLON"}
        </Badge>
      </td>
      {<Group style={{ position: "absolute", right: 10, top: 20, gap: 0 }}>
        <ActionIcon variant="transparent" onClick={() => { setSelectedGift(gift); setShowEditGiftModal(true) }}>
          <BsPencil size={12} color="black" />
        </ActionIcon>
        <ActionIcon variant="transparent">
          <BsThreeDots size={12} color="black" />
        </ActionIcon>
      </Group>}
    </tr>
  ));

  useEffect(() => {
    if (selectedGift?._id)
      // TO DO call API in order to get all the transaction for this gift
      setRowsTransaction(transactions.current.map((transaction: Transaction) => (
        <tr key={transaction._id} style={{ position: "relative" }}>
          <td>{format(new Date(transaction.date), "dd/MM/yyyy HH:mm")}</td>
          <td><Text style={{ color: transaction.points > 0 ? "#5FC86D" : "red" }}>
            {transaction.points > 0 ? "+" + transaction.points : transaction.points}
          </Text>
          </td>
          <td>{transaction.xp ? "+" + transaction.xp : "-"}</td>
          <td>
            <Stack style={{ gap: 0 }}>
              <Text style={{ color: "black" }}>{transaction.to.firstName + " " + transaction.to.lastName}</Text>
              <Text>{transaction.to.role === UserRoles.USER ? "Client" : firstLetterUpperCase(transaction.to.role)}</Text>
            </Stack>
          </td>
          {<Group style={{ position: "absolute", right: 10, top: 15, gap: 0 }}>
            <ActionIcon variant="transparent">
              <BsThreeDots size={12} color="black" />
            </ActionIcon>
          </Group>}
        </tr>
      )))
  }, [selectedGift])

  return <div className={classes.rootContainer}>
    {/* title */}
    <Title order={2}>Récompenses</Title>

    {/* filters */}
    <Group position="apart">
      <Group>
        <Select
          placeholder="Status"
          data={[
            { value: TransactionType.ACTION, label: firstLetterUpperCase(TransactionType.ACTION) },
            { value: TransactionType.PRODUCT, label: firstLetterUpperCase(TransactionType.PRODUCT) },
            { value: TransactionType.EVENT, label: firstLetterUpperCase(TransactionType.EVENT) },
          ]}
        />
      </Group>

      <Group>
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
        <Button onClick={() => { setSelectedGift({}); setShowEditGiftModal(true) }}>Nouveau</Button>
      </Group>
    </Group>

    {/* body */}
    <Paper
      p="xl"
      shadow="xs"
      style={{ borderRadius: 10, borderStyle: "solid", borderWidth: 1, borderColor: "#EDF0F2", backgroundColor: "white" }}
    >
      {/* search input */}
      <TextInput placeholder="Recherche par sponsor" icon={<IoIosSearch size={14} />} />

      {/* table */}
      <Table mt={"xl"}>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Sponsor</th>
            <th>Price</th>
            <th>XP</th>
            <th>Période</th>
            <th>Dispo</th>
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

    {/* edit gift modal */}
    <Modal
      opened={showEditGiftModal}
      onClose={() => setShowEditGiftModal(false)}
      title={<Title order={4}>{selectedGift?._id ? "Fiche Récompense" : "Nouvelle Récompense"}</Title>}
      withCloseButton={false}
      styles={{ modal: { minWidth: 600 }, title: { padding: 10, paddingTop: 0 }, body: { padding: 10 } }}
      overflow="outside"
    >
      {/* close button */}
      <ActionIcon
        variant="transparent"
        style={{ position: "absolute", top: "3%", right: "3%" }}
        onClick={() => setShowEditGiftModal(false)}
      >
        <FiX size={18} color="gray" />
      </ActionIcon>

      {selectedGift?._id
        ? <Tabs defaultValue="details">
          <Tabs.List>
            <Tabs.Tab style={{ width: "50%" }} value="details">Détails</Tabs.Tab>
            <Tabs.Tab style={{ width: "50%" }} value="transactions">Transactions</Tabs.Tab>
          </Tabs.List>

          {/* gift info */}
          <Tabs.Panel value="details" pt="xl">
            <GiftInfo selectedGift={selectedGift} onSelectedGiftChange={(gift: Gift) => setSelectedGift({ ...gift })} />
          </Tabs.Panel>

          {/* gift transactions info */}
          <Tabs.Panel value="transactions" pt="xl">
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
              <tbody>{rowsTransaction}</tbody>
            </Table>
          </Tabs.Panel>
        </Tabs>
        : <GiftInfo selectedGift={selectedGift} onSelectedGiftChange={(gift: Gift) => setSelectedGift({ ...gift })} />
      }

      {/* action buttons */}
      <Group position="right" mt="xl">
        <Text
          style={{ color: "black" }}
          sx={{
            "&:hover": {
              cursor: "pointer"
            }
          }}
          onClick={() => setShowEditGiftModal(false)}
        >
          Annuler
        </Text>
        <Button
          onClick={() => {
            // TO DO: call API
            setShowEditGiftModal(false)
          }}
        >
          Sauvegarder
        </Button>
      </Group>
    </Modal>
  </div >
}

const GiftInfo = (props: { selectedGift: Gift; onSelectedGiftChange: (gift: any) => void }) => {
  const inputFile: any = useRef()

  return <Stack align="stretch" sx={{ height: "100%" }}>
    {/* image && title && type */}
    <Grid>
      <Grid.Col span={4} style={{ display: "flex", alignItems: "center" }}>
        <input
          id="file"
          type="file"
          ref={inputFile}
          style={{ display: "none" }}
          accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
          onChange={(event) => {
            // @ts-ignore
            console.log(event.target.files[0])
            event.stopPropagation()
            event.preventDefault()

            var reader = new FileReader();
            reader.onload = function (event) {
              // @ts-ignore
              props.selectedGift.imageUrl = event.target.result
              props.onSelectedGiftChange(props.selectedGift)
            };

            const formData = new FormData()
            // @ts-ignore
            formData.append("file", event.target.files[0])
            formData.append("email", "testt@gmail.com")
            formData.append("username", "mickael67")
            formData.append("password", "Momo260799*")
            formData.append("firstName", "Mickael")
            formData.append("lastName", "Sparrow")
            formData.append("country", "BE")
            // @ts-ignore
            formData.append("confirmAge", true)
            formData.append("role", "USER")
            formData.append("code", "64820ab24d425dd8039688b7")

            axios
              .post("http://145.14.158.191:8085/api/" + "sign-up", formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then(() => console.log("ok"))

            // @ts-ignore
            reader.readAsDataURL(event.target.files[0])
          }}
        />
        <div
          style={{ display: "flex", alignItems: "center", borderRadius: 10, width: "100%", height: "100%", backgroundColor: props.selectedGift?._id ? "" : "#C3CAD1", cursor: "pointer" }}
          onClick={() => inputFile.current?.click()}
          role="presentation"
        >
          <img
            src={props.selectedGift?.imageUrl}
            alt={props.selectedGift?.imageUrl}
            style={{ width: "100%", borderRadius: 10 }}
          />
        </div>
      </Grid.Col>

      <Grid.Col span={"auto"}>
        <Stack align="stretch" style={{ height: "100%", width: "100%" }}>
          <TextInput
            required
            id="title"
            label="Titre"
            onChange={(event) => props.onSelectedGiftChange({ ...props.selectedGift, title: event.currentTarget.value })}
            value={props.selectedGift?.title}
          />
          <Select
            required
            placeholder="Type de transaction"
            label="Type"
            data={[
              { value: GiftType.GOODBUY, label: "Bon d'achat" },
              { value: GiftType.OFFER, label: "Offre" }
            ]}
            value={props.selectedGift?.type}
            onChange={(value) => props.onSelectedGiftChange({ ...props.selectedGift, type: value })}
          />
        </Stack>
      </Grid.Col>
    </Grid >

    {/* sponsor && price && xp */}
    < Grid >
      <Grid.Col span={6}>
        <TextInput
          required
          id="sponsor"
          label="Sponsor"
          onChange={(event) => props.onSelectedGiftChange({ ...props.selectedGift, sponsor: event.currentTarget.value })}
          value={props.selectedGift?.sponsor}
        />
      </Grid.Col>

      <Grid.Col span={"auto"}>
        <TextInput
          required
          id="price"
          label="Prix"
          onChange={(event) => props.onSelectedGiftChange({ ...props.selectedGift, price: event.currentTarget.value })}
          value={props.selectedGift?.price}
        />
      </Grid.Col>

      <Grid.Col span={"auto"}>
        <TextInput
          id="xp"
          label="XP"
          placeholder="XP gagné"
          onChange={(event) => props.onSelectedGiftChange({ ...props.selectedGift, xp: event.currentTarget.value })}
          value={props.selectedGift?.xp}
        />
      </Grid.Col>
    </Grid >

    {/* available && stock */}
    < Group position="apart" grow >
      <DateRangePicker
        label="Disponibilité"
        placeholder="Pick dates range"
        // @ts-ignore
        value={props.selectedGift?.start && [new Date(props.selectedGift?.start), new Date(props.selectedGift?.end)]}
        onChange={(values) => values[0] && props.onSelectedGiftChange({ ...props.selectedGift, start: values[0], end: values[1] })}
      />

      <TextInput
        id="stock"
        label="Quantité Disponible"
        onChange={(event) => props.onSelectedGiftChange({ ...props.selectedGift, stock: event.currentTarget.value })}
        value={props.selectedGift?.stock}
      />
    </Group >

    {/* description */}
    < Textarea
      placeholder="Ecrivez ici..."
      label="Description"
      maxRows={4}
      onChange={(event) => props.onSelectedGiftChange({ ...props.selectedGift, description: event.currentTarget.value })}
      value={props.selectedGift?.description}
    />
  </Stack >
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