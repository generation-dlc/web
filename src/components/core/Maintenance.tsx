import { createStyles, Image, Stack, Title, Text, useMantineTheme, Grid, Paper } from "@mantine/core"
import { useTranslation } from "react-i18next";
import crakotteSad from "../../assets/images/crakotte-sad.png";
import { useIsDark } from "../../Root";

function Maintenance() {
  const { classes } = useStyles();
  const { t } = useTranslation();
  const isDark = useIsDark();
  const theme = useMantineTheme();

  return (
    <Grid align="center" justify="center" className={classes.root}>
      <Grid.Col span={8} xs={7} sm={5} lg={4}>
        <Paper className={classes.paper} p="xl" radius="xl">
          <Stack align="center">
            <Image src={crakotteSad} className={classes.img} />
            <Stack spacing="xs">
              <Title order={4}>Crakotte est en maintenance</Title>
              <Text size="sm" color={isDark ? theme.colors.gray[5] : theme.colors.gray[6]}>
                {t("maintenance.description")}
              </Text>
            </Stack>
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  )
};

const useStyles = createStyles(theme => ({
  root: {
    height: "100%",
    margin: 0,
    background: theme.colorScheme === "dark"
      ? "linear-gradient(180deg, rgba(48,46,16,1) 0%, rgba(29,51,17,1) 100%)"
      : "linear-gradient(180deg, rgba(207,228,195,1) 0%, rgba(235,231,187,1) 100%)"
  },
  paper: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0]
  },
  img: {
    width: "8rem !important",
  },
}));

export default Maintenance;