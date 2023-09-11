import axios from "axios";
import { createStyles } from "@mantine/core"
import { useSearchParams } from "react-router-dom";

function Redirection() {
  const { classes } = useStyles()

  const code = window.location.href.split("/")[window.location.href.split("/").length - 1]
  // window.open("generation://signup/" + code)
  // window.open("https://apps.apple.com/us/app/generation-dlc/id6451407209")

  return (
    <div className={classes.rootContainer}>
    </div>
  );
};

export default Redirection;

const useStyles = createStyles(theme => ({
  rootContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#1A1224"
  },
}));