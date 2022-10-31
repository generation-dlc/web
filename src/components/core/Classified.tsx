import { useEffect, useState } from "react";
import { createStyles, Group, Stack, Text, Button, Avatar, Tooltip, ActionIcon, Grid, Breadcrumbs, Anchor } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { TbTruckDelivery } from "react-icons/tb";
import { MdOutlineGppGood } from "react-icons/md";
import { FaRegHandshake, FaChevronRight, FaRegCreditCard, FaFontAwesomeFlag } from "react-icons/fa";
import { AiOutlineInfoCircle, AiFillInfoCircle } from "react-icons/ai"
import UserRate from "../common/UserRate";

function Classified() {
  const { t } = useTranslation();
  const { classes } = useStyles();

  const [ad, setAd] = useState<any>()
  const [selectedImage, setSelectedImage] = useState<number>(0)

  useEffect(() => {
    // get all other info
    setAd(
      {
        _id: "1",
        images: [
          "https://di2ponv0v5otw.cloudfront.net/posts/2020/12/03/5fc9d80cbb59373e3bef73c2/m_5fc9d8209207861a6e318286.jpg",
          "https://img.leboncoin.fr/api/v1/lbcpb1/images/72/2b/72/722b728b5c74ad29aa6f6018a71cd1b398895993.jpg?rule=ad-large"
        ],
        title: "ps5 never used completely new !!!", // > 60 characteres 
        price: 700,
        description: "PS5 in its original box never used, bought 2 weeks ago but I dont have time to play so if youre interested please send me a message",
        creationDate: new Date().toISOString(),
        productInfo: {
          condition: "New",
          brand: "Sony",
          color: "White",
          invoice: true,
        },
        category: "Multimedia",
        subCategory: "Video Games",
        country: "France",
        creator: {
          name: "CryptoFamilly213",
          sells: 7,
          stars: 4.4
        }
      }
    )
  }, [])

  const navigationHistory = [
    { title: "Home", href: "/search" },
    { title: "Multimedia", href: "#" },
    { title: "Video Games", href: "#" },
    { title: "PS5", href: "#" },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ))

  return (
    <Stack style={{ height: "91%", marginTop: "5%", padding: 50, gap: 40 }}>
      <Breadcrumbs separator="→">{navigationHistory}</Breadcrumbs>

      <Group style={{ height: 600, gap: 30 }}>
        {/* carousel */}
        <Stack
          spacing={"xs"}
          style={{ flex: 2, height: "100%" }}
        >
          {/* image preview */}
          <Stack
            style={{ position: "relative", height: "90%", borderRadius: 5, backgroundColor: "#F1F4F5" }}
          >
            {[0, 1].map((index: number) =>
              <button
                key={index}
                className={classes.carouselNextPreviousButton}
                style={{ left: index === 0 ? 10 : undefined, right: index === 1 ? 10 : undefined }}
                onClick={() => setSelectedImage(index)}
              >
                <FaChevronRight color="white" style={{ transform: index === 0 ? "rotate(180deg)" : undefined }} />
              </button>
            )}

            <img
              alt="cfd"
              src={ad?.images[selectedImage]}
              height="100%"
              width={"auto"}
              style={{ objectFit: "contain" }}
            />
          </Stack>

          {/* image selection */}
          <Group align="center" position="left" style={{ height: "10%" }}>
            {ad?.images.map((image: any, index: number) =>
              <Stack
                key={index}
                className={classes.carouselButtonSelection}
                style={{ borderWidth: selectedImage === index ? 3 : 0 }}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  alt="cfd"
                  src={image}
                  height="100%"
                  width={"auto"}
                  style={{ objectFit: "contain" }}
                />
              </Stack>
            )}
          </Group>
        </Stack>

        {/* right panel */}
        <Stack style={{ flex: 1, height: "100%", gap: 30 }}>
          <Stack style={{ gap: 0 }}>
            <Text size={"xl"} weight="bold">{ad?.title}</Text>
            <Text style={{ fontSize: 40 }} weight="bold">${ad?.price}</Text>
          </Stack>

          <Button
            size="xl"
            rightIcon={
              <img
                //src={"../../assets/images/stable-coins.png"}
                src={"https://www.valutahandel.se/wp-content/uploads/usdc-usdt-busd-logos.png"}
                alt="stable coins"
                height={40}
              />}
            style={{ backgroundColor: "#F62143" }}
          >
            {t("user.ad.buyWith")}
          </Button>

          <Stack>
            {/* safe deal */}
            <Group position="apart">
              <Group>
                <MdOutlineGppGood size={30} />
                <Text weight="bold">{t("user.ad.safeDeal")}</Text>
              </Group>
              <Text color="grey" weight={600} style={{ cursor: "pointer" }}>{t("user.ad.learnMore")}</Text>
            </Group>

            {/* delivery */}
            <Group position="apart">
              <Group>
                <TbTruckDelivery size={30} />
                <Text weight="bold">{t("user.ad.delivery")}</Text>
              </Group>
              <Text color="grey" weight={600} style={{ cursor: "pointer" }}>{t("user.ad.howItWorks")}</Text>
            </Group>

            {/* hand to hand */}
            <Group position="apart">
              <Group>
                <FaRegHandshake size={30} />
                <Text weight="bold">{t("user.ad.handDelivery")}</Text>
              </Group>
              <Tooltip
                label="Tooltip"
                position="bottom-end"
                offset={0}
                withArrow
                arrowOffset={12}
              >
                <ActionIcon>
                  <AiFillInfoCircle size={20} style={{}} />
                </ActionIcon>
              </Tooltip>
            </Group>

            {/* card paiement */}
            <Group position="apart">
              <Group>
                <FaRegCreditCard size={30} />
                <Text weight="bold">{t("user.ad.cardPaiement")}</Text>
              </Group>
              <Tooltip
                label="Tooltip"
                position="bottom-end"
                offset={0}
                withArrow
                arrowOffset={12}
              >
                <ActionIcon>
                  <AiFillInfoCircle size={20} style={{}} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Stack>

          <Stack justify="center" style={{ flex: 1 }}>
            <Button
              size="md"
              variant="filled"
              onClick={() => window.location.href = "/messages?id=" + ad._id}
            >
              {t("user.ad.sendMessageToSeller")}
            </Button>

            <Group style={{ alignItems: "center", gap: 5 }}>
              <Avatar radius="xl" size="lg" />
              <Stack style={{ gap: 0 }}>
                <Text color="grey" size="sm" weight={700}>Alexandra</Text>
                <Group spacing={"xs"}>
                  <UserRate
                    defaultValue={(() => {
                      // const res = Math.round(result.creator.stars % 1 * 10 / 5) * 5
                      // return Math.floor(result.creator.stars) + res / 10
                      return 4
                    })()}
                    disabled
                    size={15}
                    character={<i className="anticon anticon-star" />}
                    allowHalf
                  />
                  <Text color="grey" >7 reviews</Text>
                </Group>
              </Stack>
            </Group>
          </Stack>
        </Stack>
      </Group>

      <Group>
        <Stack spacing={"xl"} style={{ flex: 2 }}>
          <Stack>
            <Text style={{ fontWeight: "bold" }}>Description</Text>
            <Text>{ad?.description}</Text>
          </Stack>

          <Stack style={{ flex: 1 }}>
            <Text weight="bold">Product information</Text>

            <Grid style={{ gap: "10%" }}>
              <Grid.Col style={{ flex: 1 }}>
                <Stack style={{ height: "100%" }}>
                  {ad && Object.keys(ad.productInfo).map((key: any, index: number) =>
                    index < 3
                      ? <Group key={key} align="flex-end" style={{ gap: 0 }}>
                        <Text weight={600} color="grey" transform="capitalize">{key}</Text>
                        <span style={{
                          flex: 1,
                          borderBottom: "dotted 2px grey",
                          margin: "0 10px 6px 10px",
                        }} />
                        <Text weight={600}>{ad?.productInfo[key]}</Text>
                      </Group>
                      : undefined
                  )}
                </Stack>
              </Grid.Col>
              <Grid.Col style={{ flex: 1 }}>
                <Stack style={{ height: "100%" }} spacing="md">
                  {ad && Object.keys(ad.productInfo).map((key: any, index: number) =>
                    index >= 3
                      ? <Group key={key} align="flex-end" style={{ gap: 0 }}>
                        <Text weight={600} color="grey" transform="capitalize">{key}</Text>
                        <span style={{
                          flex: 1,
                          borderBottom: "dotted 2px grey",
                          margin: "0 10px 6px 10px",
                        }} />
                        <Text weight={600}>{typeof ad?.productInfo[key] === "boolean"
                          ? ad?.productInfo[key]
                            ? "Yes"
                            : "No"
                          : ad?.productInfo[key]}</Text>
                      </Group>
                      : undefined
                  )}
                </Stack>
              </Grid.Col>
            </Grid>

            {/* <Stack style={{ flex: 1, alignSelf: "stretch" }}>
                <Group>
                  <Text color="grey">Invoice</Text>
                  <Text>{ad?.productInfo.invoice ? "Yes" : "No"}</Text>
                </Group>
                <Group>
                  <Text color="grey">Brand</Text>
                  <Text>{ad?.productInfo.brand}</Text>
                </Group>
              </Stack> */}
          </Stack>
        </Stack>

        <Stack style={{ flex: 1 }} />
      </Group>

      <Group style={{ gap: 50 }}>
        <Group spacing={"xs"}>
          <FaFontAwesomeFlag />
          <Text variant="link" weight={500} style={{ cursor: "pointer", color: "black" }}>{t("user.ad.reportAd")}</Text>
        </Group>
        <Group spacing={"xs"}>
          <AiOutlineInfoCircle />
          <Text variant="link" weight={500} style={{ cursor: "pointer", color: "black" }}>{t("user.ad.rightAndObligations")}</Text>
        </Group>
      </Group>
    </Stack>
  )
}

const useStyles = createStyles(theme => ({
  navbar: {
    padding: theme.spacing.lg,
    height: "91%"
  },
  rootContainer: {
    marginLeft: "40vh",
    flexDirection: "column",
    gap: 30,
    padding: theme.spacing.xl,
    paddingTop: "5%"
  },
  carouselButtonSelection: {
    height: "100%",
    width: 70,
    borderRadius: 5,
    backgroundColor: "#F1F4F5",
    cursor: "pointer",
    borderStyle: "solid",
    borderColor: theme.colors.crakotte[7]
  },
  carouselNextPreviousButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: "50%",
    height: 40,
    width: 40,
    borderRadius: 50,
    backgroundColor: "grey",
    cursor: "pointer"
  },
}));

export default Classified;