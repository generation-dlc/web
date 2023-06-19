import { createStyles, Center, Image } from "@mantine/core";
import { Outlet } from "react-router-dom";

const FormLayout = () => {
  const { classes } = useStyles();

  return (
    <Center className={classes.rootContainer}>
      <div className={classes.mainContainer}>
        <Outlet />
      </div>
    </Center>
  );
};

const useStyles = createStyles(theme => ({
  rootContainer: {
    height: "100vh",
    background: "white",
  },

  mainContainer: {
    height: "100%",
    width: "35%",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
    gap: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    zIndex: 10,

    // [theme.fn.smallerThan("xl")]: {
    //   width: "30%",
    // },
    // [theme.fn.smallerThan("lg")]: {
    //   width: "40%",
    // },
    // [theme.fn.smallerThan("md")]: {
    //   width: "50%",
    // },
    // [theme.fn.smallerThan("sm")]: {
    //   width: "65%",
    // },
    // [theme.fn.smallerThan("xs")]: {
    //   width: "90%",
    // },
  },
}));

export default FormLayout;
