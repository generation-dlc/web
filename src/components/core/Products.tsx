import { useEffect, useRef, useState } from "react";
import { createStyles, Group, Stack, Text, Pagination, ActionIcon, Title, Select, TextInput, Image, Paper, Table, Badge, Avatar, Modal, Button, Textarea, Tabs, Grid, Center, Loader, Menu } from "@mantine/core";
import { IoIosSearch } from 'react-icons/io';
import { BsPencil, BsThreeDots } from 'react-icons/bs';
import { useTranslation } from "react-i18next";
import { DateRangePicker } from '@mantine/dates';
import { Product, ProductStatus, UserRoles, Transaction, TransactionType, ProductCategory } from "../../types";
import format from "date-fns/format";
import { firstLetterUpperCase } from "../../utils";
import { FiX } from "react-icons/fi";
import { useProductService, useTransactionService } from "../../services";

export default function Products() {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const { getProductsByProperty, addProduct, editProduct, removeProduct } = useProductService()
  const { getTransactions } = useTransactionService()
  const [saveLoading, setSaveLoading] = useState(false)

  const [loading, setLoading] = useState<boolean>(true)
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [searchText, setSearchText] = useState<string>("")
  const [productStatus, setProductStatus] = useState<string>("")
  const [showEditProductModal, setShowEditProductModal] = useState<Product | any>()
  const [selectedProduct, setSelectedProduct] = useState<Product | any>()
  const [rowsTransaction, setRowsTransaction] = useState([])

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<boolean>(false)

  useEffect(() => {
    getProductsByProperty({
      error: console.error,
      loading: (value) => setLoading(value),
      success: (res) => {
        setProducts(res.products)
        setTotalPages(Math.ceil(res.count / 20))
      }
    }, {
      text: searchText,
      ...(productStatus && { status: productStatus })
    }, { page: page - 1 })
  }, [searchText, productStatus])

  const rows = products.map((product) => (
    <tr key={product._id} style={{ position: "relative" }}>
      <td>
        <Group>
          <Image
            radius="xs"
            width={80}
            src={product.imageUrl}
            alt={product.imageUrl}
          />
          <Stack style={{ gap: 0 }}>
            <Text style={{ color: "black" }}>
              {product.title}
            </Text>
            <Text>
              {product.status === ProductStatus.ON ? "Actif" : "Brouillon"}
            </Text>
          </Stack>
        </Group>
      </td>
      <td>{product.sponsor}</td>
      <td>{product.points}</td>
      <td>{product.price}€</td>
      <td>{product?.xp || "-"}</td>
      <td>{format(new Date(product.start), "dd/MM/yyyy") + " - " + format(new Date(product.end), "dd/MM/yyyy")}</td>
      <td>{product.stock - product.used}/{product.stock}</td>
      <td>
        <Badge
          size="sm"
          color={product.status === ProductStatus.ON ? "blue" : "gray"}>
          {product.status === ProductStatus.ON ? "ACTIF" : "BROUILLON"}
        </Badge>
      </td>
      {<Group style={{ position: "absolute", right: 10, top: 20, gap: 0 }}>
        <ActionIcon variant="transparent" onClick={() => { setSelectedProduct(product); setShowEditProductModal(true) }}>
          <BsPencil size={12} color="black" />
        </ActionIcon>

        {product?.id !== 0 && <Menu shadow="md" offset={0}>
          <Menu.Target>
            <ActionIcon variant="transparent">
              <BsThreeDots size={12} color="black" />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              icon={<FiX size={16} color={"red"} />}
              onClick={() => {
                setSelectedProduct(product)
                setShowDeleteConfirmationModal(true)
              }}>
              <Text style={{ color: "red" }}>
                Supprimer le produit
              </Text>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>}
      </Group>}
    </tr>
  ));

  useEffect(() => {
    if (selectedProduct?._id)
      getTransactions({
        error: console.error,
        success: (res) => setRowsTransaction(res.map((transaction: Transaction) => (
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
          </tr>
        )))
      }, { simple: true, product: selectedProduct._id })
  }, [selectedProduct])

  return <div className={classes.rootContainer}>
    {/* title */}
    <Title order={2}>Récompenses</Title>

    {/* filters */}
    <Group position="apart">
      <Group>
        <Select
          placeholder="Status"
          data={[
            { value: ProductStatus.DRAFT, label: "Brouillon" },
            { value: ProductStatus.ON, label: "Actif" },
          ]}
          onChange={(value) => setProductStatus(value as string)}
        />
      </Group>

      <Group>
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
        <Button onClick={() => { setSelectedProduct({}); setShowEditProductModal(true) }}>Nouveau</Button>
      </Group>
    </Group>

    {/* body */}
    <Paper
      p="xl"
      shadow="xs"
      style={{ borderRadius: 10, borderStyle: "solid", borderWidth: 1, borderColor: "#EDF0F2", backgroundColor: "white" }}
    >
      {/* search input */}
      <TextInput
        placeholder="Recherche par titre ou sponsor"
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
              <th>Titre</th>
              <th>Sponsor</th>
              <th>Points</th>
              <th>Prix</th>
              <th>XP</th>
              <th>Période</th>
              <th>Dispo</th>
              <th style={{ width: "15%" }}>Status</th>
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

    {/* edit product modal */}
    <Modal
      opened={showEditProductModal}
      onClose={() => setShowEditProductModal(false)}
      title={<Title order={4}>{selectedProduct?._id ? "Fiche Récompense" : "Nouvelle Récompense"}</Title>}
      withCloseButton={false}
      styles={{ modal: { minWidth: 600 }, title: { padding: 10, paddingTop: 0 }, body: { padding: 10 } }}
      overflow="outside"
    >
      {/* close button */}
      <ActionIcon
        variant="transparent"
        style={{ position: "absolute", top: "3%", right: "3%" }}
        onClick={() => setShowEditProductModal(false)}
      >
        <FiX size={18} color="gray" />
      </ActionIcon>

      {selectedProduct?._id
        ? <Tabs defaultValue="details">
          <Tabs.List>
            <Tabs.Tab style={{ width: "50%" }} value="details">Détails</Tabs.Tab>
            <Tabs.Tab style={{ width: "50%" }} value="transactions">Transactions</Tabs.Tab>
          </Tabs.List>

          {/* product info */}
          <Tabs.Panel value="details" pt="xl">
            <ProductInfo selectedProduct={selectedProduct} onSelectedProductChange={(product: Product) => setSelectedProduct({ ...product })} />
          </Tabs.Panel>

          {/* product transactions info */}
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
        : <ProductInfo selectedProduct={selectedProduct} onSelectedProductChange={(product: Product) => setSelectedProduct({ ...product })} />
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
          onClick={() => setShowEditProductModal(false)}
        >
          Annuler
        </Text>
        <Button
          loading={saveLoading}
          onClick={() => {
            const formData = new FormData()

            for (const key in selectedProduct)
              // @ts-ignore
              formData.append(key, selectedProduct[key])

            if (selectedProduct._id)
              editProduct({
                error: console.error,
                loading: (value) => setSaveLoading(value),
                success: (res) => {
                  products[products.map(product => product._id).indexOf(res._id)] = res
                  setProducts([...products])
                  setShowEditProductModal(false)
                }
              }, selectedProduct._id, formData)
            else
              addProduct({
                error: console.error,
                loading: (value) => setSaveLoading(value),
                success: (res) => {
                  setProducts([...products, res])
                  setShowEditProductModal(false)
                }
              }, formData)
          }}
        >
          Sauvegarder
        </Button>
      </Group>
    </Modal>

    {/* delete confirmation modal */}
    <Modal
      opened={showDeleteConfirmationModal}
      onClose={() => setShowDeleteConfirmationModal(false)}
      title={<Title order={4}>{"Etes-vous sur de vouloir supprimer ce produit ?"}</Title>}
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
          onClick={() => removeProduct({
            error: console.error,
            success: (res) => {
              products.splice(products.map(p => p._id).indexOf(res._id), 1)
              setProducts([...products])
              setShowDeleteConfirmationModal(false)
            }
          }, selectedProduct._id)
          }>
          Supprimer
        </Button>
      </Group>
    </Modal>
  </div >
}

const ProductInfo = (props: { selectedProduct: Product; onSelectedProductChange: (product: any) => void }) => {
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
            event.stopPropagation()
            event.preventDefault()

            // @ts-ignore
            props.selectedProduct.file = event.target.files[0]

            var reader = new FileReader();
            reader.onload = function (event) {
              // @ts-ignore
              props.selectedProduct.imageUrl = event.target.result
              props.onSelectedProductChange(props.selectedProduct)
            };

            // @ts-ignore
            reader.readAsDataURL(event.target.files[0])
          }}
        />
        <div
          style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 10, width: "100%", height: "100%", backgroundColor: props.selectedProduct?._id ? "" : "#C3CAD1", cursor: "pointer" }}
          onClick={() => inputFile.current?.click()}
          role="presentation"
        >
          {!props.selectedProduct?.imageUrl
            ? <Text style={{ color: "black", fontSize: 30 }}>+</Text>
            : <img
              src={props.selectedProduct?.imageUrl}
              alt={props.selectedProduct?.imageUrl}
              style={{ width: "100%", borderRadius: 10 }}
            />
          }
        </div>
      </Grid.Col>

      <Grid.Col span={"auto"}>
        <Stack align="stretch" style={{ height: "100%", width: "100%" }}>
          <TextInput
            required
            id="title"
            label="Titre"
            onChange={(event) => props.onSelectedProductChange({ ...props.selectedProduct, title: event.currentTarget.value })}
            value={props.selectedProduct?.title}
          />
          <Select
            required
            placeholder="Status"
            label="Status"
            data={[
              { value: ProductStatus.ON, label: "Actif" },
              { value: ProductStatus.DRAFT, label: "Brouillon" }
            ]}
            value={props.selectedProduct?.status}
            onChange={(value) => props.onSelectedProductChange({ ...props.selectedProduct, status: value })}
          />
          <Select
            required
            placeholder="Categorie"
            label="Categorie"
            data={[
              { value: ProductCategory.DRINK, label: "Boissons" },
              { value: ProductCategory.TRIP, label: "Voyages" },
              { value: ProductCategory.OTHERS, label: "Autres" }
            ]}
            value={props.selectedProduct?.category}
            onChange={(value) => props.onSelectedProductChange({ ...props.selectedProduct, category: value })}
          />
        </Stack>
      </Grid.Col>
    </Grid >

    {/* sponsor && points && xp */}
    < Grid >
      <Grid.Col span={6}>
        <TextInput
          required
          id="sponsor"
          label="Sponsor"
          onChange={(event) => props.onSelectedProductChange({ ...props.selectedProduct, sponsor: event.currentTarget.value })}
          value={props.selectedProduct?.sponsor}
        />
      </Grid.Col>

      <Grid.Col span={"auto"}>
        <TextInput
          required
          id="points"
          label="Points"
          onChange={(event) => props.onSelectedProductChange({ ...props.selectedProduct, points: event.currentTarget.value })}
          value={props.selectedProduct?.points}
        />
      </Grid.Col>

      <Grid.Col span={"auto"}>
        <TextInput
          required
          id="price"
          label="Prix"
          placeholder="€"
          onChange={(event) => props.onSelectedProductChange({ ...props.selectedProduct, price: event.currentTarget.value })}
          value={props.selectedProduct?.price}
        />
      </Grid.Col>

      <Grid.Col span={"auto"}>
        <TextInput
          id="xp"
          label="XP"
          placeholder="XP gagné"
          onChange={(event) => props.onSelectedProductChange({ ...props.selectedProduct, xp: event.currentTarget.value })}
          value={props.selectedProduct?.xp}
        />
      </Grid.Col>
    </Grid >

    {/* available && stock */}
    <Group position="apart" grow>
      <DateRangePicker
        required
        dropdownPosition="bottom-start"
        label="Disponibilité"
        placeholder="Pick dates range"
        // @ts-ignore
        value={props.selectedProduct?.start && [new Date(props.selectedProduct?.start), new Date(props.selectedProduct?.end)]}
        onChange={(values) => values[0] && props.onSelectedProductChange({ ...props.selectedProduct, start: values[0], end: values[1] })}
      />

      <TextInput
        required
        id="stock"
        label="Quantité Disponible"
        onChange={(event) => props.onSelectedProductChange({ ...props.selectedProduct, stock: event.currentTarget.value })}
        value={props.selectedProduct?.stock}
      />
    </Group >

    {/* description */}
    <Textarea
      placeholder="Ecrivez ici..."
      label="Description"
      maxRows={4}
      onChange={(event) => props.onSelectedProductChange({ ...props.selectedProduct, description: event.currentTarget.value })}
      value={props.selectedProduct?.description}
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