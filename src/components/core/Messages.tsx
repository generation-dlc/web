import { useEffect, useState } from "react";
import { createStyles, Navbar, Group, Stack, Text, Paper, Avatar, ActionIcon, ScrollArea, Textarea } from "@mantine/core";
import { useTranslation } from "react-i18next";
import UserRate from "../common/UserRate";
import { FiSend } from "react-icons/fi";
import { AiOutlineWarning, AiOutlineInfoCircle } from "react-icons/ai";

function Messages() {
  const { t } = useTranslation();
  const { classes } = useStyles();

  const myId = 1

  const [conversations, setConversations] = useState<any>([
    {
      _id: "1",
      messages: [
        {
          _id: "1",
          senderId: 1,
          text: "Ca serait pour savoir quelle serait votre dernier prix sachant que je ne suis pas du même pays donc il faut ajouter les frais denvoi svp",
          creationDate: new Date().toISOString()
        },
        {
          _id: "2",
          senderId: 2,
          text: "Mon dernier prix sera de $500 fdp",
          creationDate: new Date().toISOString()
        },
        {
          _id: "3",
          senderId: 2,
          text: "C'est bon pour vous ?",
          creationDate: new Date().toISOString()
        }
      ]
    },
    {
      _id: "2",
      messages: [
        {
          _id: "1",
          senderId: 1,
          text: "Bonjour est ce que vous vendez des jeux avec la console ?",
          creationDate: new Date().toISOString()
        },
        {
          _id: "2",
          senderId: 1,
          text: "Et quel est votre dernier prix svp ?",
          creationDate: new Date().toISOString()
        },
        {
          _id: "3",
          senderId: 2,
          text: "Bonjour, non et $650",
          creationDate: new Date().toISOString()
        },
      ]
    }
  ])
  const [selectedConversation, setSelectedConversation] = useState(0)

  useEffect(() => {

  }, [])

  return (
    <>
      <Conversations
        conversations={conversations}
        selectedConversation={selectedConversation}
        onClickOnConversation={(index: number) => setSelectedConversation(index)}
      />

      <div className={classes.rootContainer}>
        <Group align="flex-start" style={{ height: "100%", gap: 0 }}>
          {/* centered pannel */}
          <Stack style={{ flex: 2.5, height: "100%", backgroundColor: "white", gap: 0 }}>
            {/* warning message */}
            <Paper shadow="sm" style={{ zIndex: 1, flex: 1, borderRadius: 10, overflow: "hidden", marginTop: 10, marginLeft: 20, marginRight: 20 }}>
              <Group style={{ flex: 1, height: "100%", backgroundColor: "#FCE3B6" }}>
                <div style={{ backgroundColor: "#E18F1F", width: "1%", height: "100%" }} />
                <AiOutlineWarning size={30} color="#E6A342" />
                <Text weight="bold" style={{ fontSize: "0.9vw" }}>{t("user.message.warningMessage")}</Text>
                <Group position="right" style={{ flex: 1, paddingRight: 5 }}>
                  <ActionIcon radius="xl">
                    <AiOutlineInfoCircle size={25} color="orange" />
                  </ActionIcon>
                </Group>
              </Group>
            </Paper>

            {/* messages area */}
            <ScrollArea style={{ height: "73vh", padding: 20, paddingBottom: 0, paddingTop: 0 }}>
              {conversations[selectedConversation]?.messages.map((message: any) =>
                <Group
                  key={message._id}
                  position={myId === message.senderId ? "right" : "left"}
                  style={{ marginTop: 10 }}
                >
                  <Stack
                    className={classes.message}
                    style={{
                      borderBottomLeftRadius: myId !== message.senderId ? 0 : 10,
                      borderBottomRightRadius: myId === message.senderId ? 0 : 10
                    }}
                    sx={(theme) => ({ backgroundColor: myId !== message.senderId ? "#F6F6F6" : theme.colors.crakotte[7] })}
                  >
                    <Text
                      color={myId === message.senderId ? "white" : "black"}
                      weight={500}
                    >
                      {message.text}
                    </Text>
                  </Stack>
                </Group>
              )}
            </ScrollArea>

            {/* user message input */}
            <Group style={{ height: "11vh", padding: "1%", paddingLeft: 20, paddingRight: 20 }}>
              <Textarea placeholder="Your message..." style={{ flex: 1 }} />
              <ActionIcon color="blue" radius={"xl"} size="xl">
                <FiSend size="xl" style={{ padding: 7 }} />
              </ActionIcon>
            </Group>
          </Stack>

          {/* right pannel */}
          <Stack style={{ flex: 1, padding: 10 }}>
            {/* user info */}
            <Group position="left" style={{ borderRadius: 10, padding: 20, backgroundColor: "white" }}>
              <Avatar radius="xl" size="lg" />
              <Stack style={{ gap: 0 }}>
                <Text color="grey">Sandrine</Text>
                <UserRate
                  // defaultValue={(() => {
                  //   const res = Math.round(result.creator.stars % 1 * 10 / 5) * 5
                  //   return Math.floor(result.creator.stars) + res / 10
                  // })()}
                  disabled
                  size={20}
                  character={<i className="anticon anticon-star" />}
                  allowHalf
                />
              </Stack>
            </Group>

            {/* ads info */}
            <Group position="left" style={{ borderRadius: 10, padding: 20, backgroundColor: "white" }}>
              <img
                src={"https://di2ponv0v5otw.cloudfront.net/posts/2020/12/03/5fc9d80cbb59373e3bef73c2/m_5fc9d8209207861a6e318286.jpg"}
                alt={"ps5"}
                height="auto"
                width={"20%"}
                style={{ objectFit: "cover", borderRadius: 10 }}
              />

              <Stack style={{ alignSelf: "stretch", maxWidth: "26vh", gap: 0 }}>
                <Text weight="bold" style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                  New PS5
                </Text>
              </Stack>
            </Group>
          </Stack>
        </Group>
      </div>
    </>
  )
}

const Conversations = (props: {
  conversations: any,
  selectedConversation: number,
  onClickOnConversation: (index: number) => void
}) => {
  const { classes } = useStyles();

  return <Navbar width={{ base: "40vh" }} className={classes.navbar} >
    <Navbar.Section sx={{ display: "flex", flex: 1, flexDirection: "column" }}>
      <Stack style={{ flex: 1, gap: "2rem" }}>
        <ScrollArea style={{ height: "91vh", width: "40vh" }}>
          {props.conversations.map((conversation: any, index: number) =>
            <Group
              key={conversation._id}
              style={{ height: 100, padding: 20, cursor: "pointer", backgroundColor: props.selectedConversation === index ? "#F6F7F9" : "" }}
              sx={(theme) => ({
                "&:hover": {
                  backgroundColor: "#E0E6EB"
                }
              })}
              onClick={() => props.onClickOnConversation(index)}
            >
              <img
                src={"https://di2ponv0v5otw.cloudfront.net/posts/2020/12/03/5fc9d80cbb59373e3bef73c2/m_5fc9d8209207861a6e318286.jpg"}
                alt={"ps5"}
                height="auto"
                width={"20%"}
                style={{ objectFit: "cover", borderRadius: 10 }}
              />

              <Stack style={{ alignSelf: "stretch", maxWidth: "26vh", gap: 0 }}>
                <Text weight="bold" style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                  New PS5
                </Text>
                {!!conversation.messages.length &&
                  <Text size="xs" style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                    {conversation.messages[conversation.messages.length - 1]?.text}
                  </Text>}
                {!!conversation.messages.length &&
                  <Text size="xs">
                    {new Date(conversation.messages[conversation.messages.length - 1]?.creationDate).toLocaleDateString()}
                  </Text>}
              </Stack>
            </Group>
          )}
        </ScrollArea>
      </Stack>
    </Navbar.Section>
  </Navbar >
}

const useStyles = createStyles(theme => ({
  navbar: {
    height: "91%"
  },
  rootContainer: {
    paddingTop: "9vh",
    marginLeft: "40vh",
    paddingRight: 10,
    height: "100%",
    flexDirection: "column"
  },
  message: {
    flexWrap: "wrap",
    width: "fit-content",
    maxWidth: "70%",
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10
  }
}))

export default Messages;