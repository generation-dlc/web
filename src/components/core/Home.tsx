import { createStyles, Button, Container, Text, Paper, Flex, Group } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks";
import { AiFillApple } from "react-icons/ai";
import { FaGooglePlay } from "react-icons/fa";

function Home() {
  const { classes } = useStyles()
  const isMobile = useMediaQuery("(max-width: 747px)")

  return (
    <div className={classes.rootContainer}>
      <Text m="xl" style={{ fontWeight: "bold", fontSize: 40, color: "#5E2987" }}>Generation</Text>

      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", backgroundColor: "#1A1224" }}>
        <Paper style={{ flex: 1, backgroundColor: "#1A1224" }} ml="xl">
          <div style={{ padding: window.innerWidth * 0.05 }}>
            <Text style={{ fontWeight: "bold", fontSize: isMobile ? 30 : 40, color: "white" }}>{"L'application qui vous accompagne pendant vos sorties ! 🎉"}</Text>
            <Text
              style={{
                fontSize: isMobile ? 17 : 20,
                color: "white",
                marginTop: isMobile ? window.innerWidth * 0.1 : window.innerWidth * 0.02,
                marginBottom: isMobile ? window.innerWidth * 0.05 : 0
              }}
            >
              {"Generation est un réseau social privé qui vous permet de partager vos sorties avec vos amis. Rejoignez dès maintenant notre communauté en téléchargeant l'application sur votre mobile."}
            </Text>
            {isMobile && <ImagePresentation />}
            <Group
              position="center"
              style={{ marginTop: window.innerWidth * 0.05 }}
            >
              <Button
                size="xl"
                leftIcon={<AiFillApple size={20} />}
                style={{ borderRadius: 100, backgroundColor: "black" }}
                onClick={() => window.open("https://apps.apple.com/us/app/generation-dlc/id6451407209")}
              >
                App Store
              </Button>
              <Button
                size="xl"
                leftIcon={<FaGooglePlay size={15} />}
                style={{ borderRadius: 100, backgroundColor: "black" }}
                onClick={() => window.open("https://play.google.com/store/apps/details?id=com.generation")}
              >
                Play Store
              </Button>
            </Group>
          </div>
        </Paper>
        {!isMobile && <ImagePresentation />}
      </div>

      <Group position="center" style={{ height: "100%", backgroundColor: "#1A1224", alignItems: "flex-end", paddingBottom: 10 }}>
        <Text>Copyright © Generation | All Rights Reserved</Text>
      </Group>
    </div>
  );
};

const ImagePresentation = () => {
  const isMobile = useMediaQuery("(max-width: 747px)")

  return <Paper style={{ display: "flex", justifyContent: "center", flex: 1, backgroundColor: "#1A1224" }}>
    <img
      alt="presentation"
      src="https://i.ibb.co/FgVxnqd/image-7.png"
      width={isMobile ? "100%" : "47%"}
      style={{ justifyContent: "center" }}
    />
  </Paper>
}

export default Home;

const useStyles = createStyles(theme => ({
  rootContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#1A1224"
  },
}));