import { Box, createStyles, Group, Stack, Text, Pagination, ActionIcon, Avatar } from "@mantine/core";
import styled from "styled-components";
import Rate from "rc-rate";
import 'rc-rate/assets/index.css';
import { useProfile } from "../../store/reducers/user-reducer";
import { HiOutlineHeart } from "react-icons/hi";
import { FaHistory } from "react-icons/fa";
import { useIsDark } from "../../Root";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const StyledRate = styled(Rate)`
  &.rc-rate {
    font-size: ${({ size }: { size: number }) => size}px;
  }
`

function Home() {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const profile = useProfile();
  const isDark = useIsDark();

  const search = "playstation 5"
  const [results, setResults] = useState<Array<any>>([
    {
      id: "1",
      image: "https://di2ponv0v5otw.cloudfront.net/posts/2020/12/03/5fc9d80cbb59373e3bef73c2/m_5fc9d8209207861a6e318286.jpg",
      title: "ps5 never used completely new !!!", // > 60 characteres 
      price: 700,
      creationDate: new Date().toISOString(),
      creator: {
        name: "CryptoFamilly213",
        sells: 7,
        stars: 4.4
      }
    },
    {
      id: "2",
      image: "https://external-preview.redd.it/CngC5P89BYdlls9ZS49Njhfc8S4Upd8i6OUhWIDgf1E.jpg?auto=webp&s=75e5d5b928f693294b7369b8302ae41eae4492ae",
      title: "ps5 in its box", // > 60 characteres 
      price: 520,
      creationDate: new Date().toISOString(),
      creator: {
        name: "Sonyy",
        sells: 3,
        stars: 2.1
      }
    }, {
      id: "3",
      image: "https://i.ebayimg.com/images/g/RykAAOSw8W1jR6nj/s-l500.jpg",
      title: "Broken PS5", // > 60 characteres 
      price: 200,
      creationDate: new Date().toISOString(),
      creator: {
        name: "Alexy Sam",
        sells: 0,
        stars: 0
      }
    },
    {
      id: "4",
      image: "https://smartmania.cz/wp-content/uploads/2021/01/PlayStation_5_recenze.jpg",
      title: "Playsation 5 in perfect conditions", // > 60 characteres 
      price: 550,
      creationDate: new Date().toISOString(),
      creator: {
        name: "ForexMania",
        sells: 13,
        stars: 3.6
      }
    }
  ])
  const [page, setPage] = useState<number>(1)

  return <Box className={classes.rootContainer}>
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
          <Stack style={{ flex: 1, height: "100%", padding: 10 }}>
            {/* title and creator info */}
            <Group position="apart">
              <div style={{ flex: 1 }}>
                <Text
                  size="xl"
                  style={{ display: "inline-block" }}
                  sx={() => ({ cursor: "pointer", "&:hover": { color: "#2b6bfe" } })}
                >
                  {result.title}
                </Text>
              </div>

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
                    size={15}
                    character={<i className="anticon anticon-star" />}
                    allowHalf
                  />
                  <Text size="xs" color="grey">({result.creator.sells})</Text>
                </Group>
              </Stack>
            </Group>

            {/* date */}
            <Group spacing="xs">
              <FaHistory color="grey" />
              <Text color="grey">{new Date(result.creationDate).toLocaleDateString()}</Text>
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
}



const useStyles = createStyles(theme => ({
  rootContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 30,
  },
}));

export default Home
