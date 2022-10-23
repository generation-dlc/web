import { useState } from "react";
import { Box, createStyles, Group, Stack, Text, Pagination, ActionIcon, Navbar, Avatar, Button, Input, NumberInput, Checkbox } from "@mantine/core";
import styled from "styled-components";
import Rate from "rc-rate";
import 'rc-rate/assets/index.css';
import {
  Menu as MultipleLevelMenu,
  MenuItem as MenuItemInner,
  SubMenu as SubMenuInner
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/core.css";
import 'rc-rate/assets/index.css';
import { useProfile } from "../../store/reducers/user-reducer";
import { HiOutlineHeart } from "react-icons/hi";
import styles from "./styles.module.css";
import { useTranslation } from "react-i18next";
import { HiSearch, HiDotsHorizontal } from "react-icons/hi";
import { AiOutlineUnorderedList, AiFillHome } from "react-icons/ai";
import { BsFillPhoneFill } from "react-icons/bs"
import { GiClothes } from "react-icons/gi"
import { FaChevronRight, FaHandshake } from "react-icons/fa";
import { BiBasketball } from "react-icons/bi"
import { useIsDark } from "../../Root";

const StyledRate = styled(Rate)`
  &.rc-rate {
    font-size: ${({ size }: { size: number }) => size}px;
  }
`

function Search() {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const profile = useProfile();
  const isDark = useIsDark();

  const search = "playstation 5"
  const [results, setResults] = useState<Array<any>>([
    {
      _id: "1",
      image: "https://di2ponv0v5otw.cloudfront.net/posts/2020/12/03/5fc9d80cbb59373e3bef73c2/m_5fc9d8209207861a6e318286.jpg",
      title: "ps5 never used completely new !!!", // > 60 characteres 
      price: 700,
      creationDate: new Date().toISOString(),
      category: "Multimedia",
      subCategory: "Video Games",
      country: "France",
      creator: {
        name: "CryptoFamilly213",
        sells: 7,
        stars: 4.4
      }
    },
    {
      _id: "2",
      image: "https://external-preview.redd.it/CngC5P89BYdlls9ZS49Njhfc8S4Upd8i6OUhWIDgf1E.jpg?auto=webp&s=75e5d5b928f693294b7369b8302ae41eae4492ae",
      title: "ps5 in its box", // > 60 characteres 
      price: 520,
      creationDate: new Date().toISOString(),
      category: "Multimedia",
      subCategory: "Video Games",
      country: "Japan",
      creator: {
        name: "Sonyy",
        sells: 3,
        stars: 2.1
      }
    }, {
      _id: "3",
      image: "https://i.ebayimg.com/images/g/RykAAOSw8W1jR6nj/s-l500.jpg",
      title: "Broken PS5", // > 60 characteres 
      price: 200,
      creationDate: new Date().toISOString(),
      category: "Multimedia",
      subCategory: "Video Games",
      creator: {
        name: "Alexy Sam",
        sells: 0,
        stars: 0
      }
    },
    {
      _id: "4",
      image: "https://smartmania.cz/wp-content/uploads/2021/01/PlayStation_5_recenze.jpg",
      title: "Playsation 5 in perfect conditions", // > 60 characteres 
      price: 550,
      creationDate: new Date().toISOString(),
      category: "Multimedia",
      subCategory: "Video Games",
      creator: {
        name: "ForexMania",
        sells: 13,
        stars: 3.6
      }
    }
  ])
  const [page, setPage] = useState<number>(1)

  return <>
    <Filters />
    <Box className={classes.rootContainer}>
      <Stack style={{ gap: 5 }}>
        <Text size="xl">{search}</Text>
        <Text style={{ color: "grey" }} size="sm">100 {t("user.search.results")}</Text>
      </Stack>

      <Stack spacing="md">
        {results.map((result: any, index: number) =>
          <Group
            key={result.id}
            style={{ position: "relative", height: 250, padding: 25, borderRadius: 20, backgroundColor: "white" }}
          >
            {/* image */}
            <div style={{ display: "flex", justifyContent: "center", width: "25%", height: "100%", borderRadius: 20, overflow: "hidden", cursor: "pointer", backgroundColor: "#F6F7F9" }}>
              <img
                src={result.image}
                alt={search}
                height="auto"
                width={"100%"}
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* info */}
            <Stack style={{ flex: 1, height: "100%" }}>
              {/* title and creator info */}
              <Group position="apart" align={"flex-start"}>
                {/* title */}
                <Stack style={{ gap: 0 }}>
                  <Text
                    size="xl"
                    style={{ display: "inline-block" }}
                    sx={() => ({ cursor: "pointer", "&:hover": { color: "#2b6bfe" } })}
                    component="a"
                    href={"/" + result.category.toLowerCase() + "/" + result._id}
                  >
                    {result.title}
                  </Text>

                  {/* subcategory & date */}
                  <Group style={{ gap: 0 }}>
                    <Text color="grey" size="sm" mr={5}>{result.subCategory + " -"}</Text>
                    <Text color="grey" size="sm">{new Date(result.creationDate).toLocaleDateString()}</Text>
                  </Group>

                  {/* country */}
                  <Text color="grey" size="sm">{result.country}</Text>
                </Stack>

                {/* creator info */}
                <Stack style={{ gap: 5, alignItems: "flex-end" }}>
                  <Group style={{ alignItems: "center", gap: 5 }}>
                    <Text color="grey" size="xs">{result.creator.name}</Text>
                    <Avatar radius="xl" />
                  </Group>
                  <Group style={{ gap: 0 }}>
                    <StyledRate
                      defaultValue={(() => {
                        const res = Math.round(result.creator.stars % 1 * 10 / 5) * 5
                        return Math.floor(result.creator.stars) + res / 10
                      })()}
                      disabled
                      size={10}
                      character={<i className="anticon anticon-star" />}
                      allowHalf
                    />
                    <Text size="xs" color="grey">({result.creator.sells})</Text>
                  </Group>
                </Stack>
              </Group>

              {/* price */}
              <Stack style={{ flex: 1, justifyContent: "flex-end" }}>
                <Group>
                  <Text size="xl">
                    ${result.price}
                  </Text>
                  <img
                    src={"https://www.valutahandel.se/wp-content/uploads/usdc-usdt-busd-logos.png"}
                    alt="stable coins"
                    height={40}
                  />
                </Group>
              </Stack>
            </Stack>

            {/* add to favorite */}
            <ActionIcon style={{ position: "absolute", bottom: 20, right: 20 }}>
              <HiOutlineHeart size={"100%"} />
            </ActionIcon>
          </Group>
        )}
      </Stack>

      <Group position="right">
        <Pagination
          page={page}
          onChange={setPage}
          total={10}
        />
      </Group>
    </Box>
  </>
}

const Filters = () => {
  const { t } = useTranslation();
  const { classes } = useStyles();

  const [searchValue, setSearchValue] = useState<Array<string>>([])
  const [categories, setCategories] = useState<Array<any>>([
    {
      name: "Multimedia",
      childrens: [
        {
          name: "Phones"
        },
        {
          name: "PC"
        },
        {
          name: "Video Games"
        },
        {
          name: "Picture & Sound"
        }
      ]
    },
    {
      name: "Fashion",
      childrens: [
        {
          name: "Clothes"
        },
        {
          name: "Jeans"
        },
        {
          name: "Shoes"
        },
        {
          name: "Watches"
        },
        {
          name: "Baby Clothes"
        },
        {
          name: "Luxury"
        }
      ]
    },
    {
      name: "Hobbies",
      childrens: [
        {
          name: "Books"
        },
        {
          name: "Sports"
        },
        {
          name: "Music"
        },
        {
          name: "Bikes"
        },
        {
          name: "Toys"
        }
      ]
    },
    {
      name: "Home",
      childrens: [
        {
          name: "Furnitures"
        },
        {
          name: "Home Appliance"
        },
        {
          name: "Decoration"
        },
        {
          name: "DIY"
        }
      ]
    },
    {
      name: "Service Delivery"
    },
    {
      name: "Others"
    }
  ])
  const [selectedCategory, setSelectedCategory] = useState<any>(
    {
      label: t("user.search.allCategories"),
      category: t("user.search.allCategories")
    }
  )
  const [deliveryChecked, setDeliveryChecked] = useState<boolean>(false)

  function getRightIcon(categoryName: string) {
    if (categoryName === t("user.search.allCategories"))
      return <AiOutlineUnorderedList />
    else if (categoryName === "Multimedia")
      return <BsFillPhoneFill />
    else if (categoryName === "Fashion")
      return <GiClothes />
    else if (categoryName === "Hobbies")
      return <BiBasketball />
    else if (categoryName === "Home")
      return <AiFillHome />
    else if (categoryName === "Service Delivery")
      return <FaHandshake />
    else
      return <HiDotsHorizontal />
  }

  const menuClassName = ({ state }: any) =>
    state === "opening"
      ? styles.menuOpening
      : state === "closing"
        ? styles.menuClosing
        : styles.menu;

  const menuItemClassName = ({ hover }: any) =>
    hover ? styles.menuItemHover : styles.menuItem;

  const submenuItemClassName = (modifiers: any) =>
    `${styles.submenuItem} ${menuItemClassName(modifiers)}`;

  const MenuItem = (props: any) => (
    <MenuItemInner
      {...props}
      className={menuItemClassName}
      onClick={() => setSelectedCategory({ category: props.categoryName, label: props.label })}
    >
      <Group>
        {props.showIcon && getRightIcon(props.categoryName)}
        <Text>{props.label}</Text>
      </Group>
    </MenuItemInner >
  );

  const SubMenu = (props: any) => (
    <SubMenuInner
      {...props}
      menuClassName={menuClassName}
      itemProps={{ className: submenuItemClassName }}
      offsetY={-7}
    />
  );

  return (
    <Navbar width={{ base: "23%" }} className={classes.navbar} >
      <Navbar.Section sx={{ display: "flex", flex: 1, flexDirection: "column", padding: 10 }}>
        <Stack style={{ flex: 1, gap: "2rem" }}>
          <Group position="apart">
            <Text color="grey">{t("user.search.filters")}</Text>
            <Text sx={() => ({ cursor: "pointer" })} onClick={() => console.log("clear")}>
              {t("user.search.clearAll")}
            </Text>
          </Group>

          {/* search */}
          <Stack style={{ gap: 5 }}>
            <Text>{t("user.search.search")}</Text>
            <Input
              placeholder="playstation 5"
              rightSection={<HiSearch />}
            />
          </Stack>

          {/* categories */}
          <Stack style={{ gap: 5 }}>
            <Text>{t("user.search.categories")}</Text>
            <MultipleLevelMenu
              transition
              menuClassName={menuClassName}
              align={"start"}
              viewScroll={"auto"}
              offsetY={5}
              menuButton={
                <Button
                  leftIcon={getRightIcon(selectedCategory.category)}
                  variant="default"
                >
                  {selectedCategory.label}
                </Button>
              }>

              <MenuItem label={t("user.search.allCategories")} showIcon={true} categoryName={t("user.search.allCategories")} />

              {categories.map((category: any) =>
                category.childrens
                  ? <SubMenu
                    key={category.name}
                    label={() =>
                      <Group>
                        {getRightIcon(category.name)}
                        {category.name}
                        <Group position="right" style={{ flex: 1 }}>
                          <FaChevronRight color="white" />
                        </Group>
                      </Group>
                    }
                    offsetY={-7}
                    offsetX={5}
                  >
                    {[{ name: category.name }, ...category.childrens].map((children: any, index: number) =>
                      <MenuItem key={children.name} label={children.name} showIcon={!index} categoryName={category.name} />
                    )}
                  </SubMenu>
                  : <MenuItem label={category.name} showIcon={true} categoryName={category.name} />
              )}
            </MultipleLevelMenu>
          </Stack>

          {/* price */}
          <Stack style={{ gap: 5 }}>
            <Text>Price Range ($)</Text>
            <Stack align={"center"} style={{ padding: 20, borderStyle: "solid", borderWidth: 1, borderColor: "#EBEAED", borderRadius: 10 }}>
              <Group>
                <NumberInput label="Min." style={{ flex: 1 }} sx={() => ({ label: { color: "grey" } })} />
                <NumberInput label="Max." style={{ flex: 1 }} sx={() => ({ label: { color: "grey" } })} />
              </Group>
              <Checkbox
                label="Including delivery price"
                checked={deliveryChecked}
                onChange={(event) => setDeliveryChecked(event.currentTarget.checked)}
                sx={() => ({ label: { color: "grey" } })}
              />
            </Stack>
          </Stack>

          {/* stars */}
          {/* <Stack style={{ gap: 5 }}>
              <Text>Seller Reliability</Text>
              <StyledRate defaultValue={0} disabled size={20} character={<i className="anticon anticon-star" />} />
            </Stack> */}
        </Stack>

        <Button>
          {t("user.search.search")}
        </Button>
      </Navbar.Section>
    </Navbar >
  )
}

const useStyles = createStyles(theme => ({
  navbar: {
    padding: theme.spacing.lg,
    height: "91%"
  },
  rootContainer: {
    marginLeft: "23%",
    width: "77%",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 30,
    padding: theme.spacing.xl,
  },
}));

export default Search