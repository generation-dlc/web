import { createStyles, Center, Image } from "@mantine/core";
import crakotte from "../../assets/images/crakotte.png";
import { Outlet } from "react-router-dom";

const FormLayout = () => {
  const { classes } = useStyles();

  return (
    <Center className={classes.rootContainer}>
      <div className={classes.mainContainer}>
        <Outlet />
        <Image src={crakotte} className={classes.img} />
      </div>
    </Center>
  );
};

const useStyles = createStyles(theme => ({
  rootContainer: {
    height: "100vh",
    background: theme.colorScheme === "dark"
      ? "linear-gradient(180deg, rgba(48,46,16,1) 0%, rgba(29,51,17,1) 100%)"
      : "linear-gradient(180deg, rgba(207,228,195,1) 0%, rgba(235,231,187,1) 100%)",
    position: "static"
  },

  mainContainer: {
    height: "100%",
    width: "30%",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
    gap: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    zIndex: 10,

    [theme.fn.smallerThan("xl")]: {
      width: "30%",
    },
    [theme.fn.smallerThan("lg")]: {
      width: "40%",
    },
    [theme.fn.smallerThan("md")]: {
      width: "50%",
    },
    [theme.fn.smallerThan("sm")]: {
      width: "65%",
    },
    [theme.fn.smallerThan("xs")]: {
      width: "90%",
    },
  },

  img: {
    alignSelf: "center",
    width: "6rem !important",
    position: "absolute",
    bottom: theme.spacing.md,
  },
}));

export default FormLayout;
