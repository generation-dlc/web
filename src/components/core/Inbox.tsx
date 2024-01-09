import { useEffect, useRef, useState } from "react";
import { createStyles, Group, Title, Button, Paper, Stack, Text, Avatar, TextInput, ActionIcon, ScrollArea, Divider, MultiSelect, MultiSelectValueProps, CloseButton, Box } from "@mantine/core";
import 'rc-rate/assets/index.css';
import "@szhsin/react-menu/dist/core.css";
import 'rc-rate/assets/index.css';
import { useProfile } from "../../store/reducers/user-reducer";
import differenceInMinutes from 'date-fns/differenceInMinutes'
import differenceInHours from 'date-fns/differenceInHours'
import differenceInDays from 'date-fns/differenceInDays'
import differenceInMonths from 'date-fns/differenceInMonths'
import differenceInYears from 'date-fns/differenceInYears'
import { useTranslation } from "react-i18next";
import { User, UserRoles } from "../../types";
import { IoIosSearch } from "react-icons/io";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useConversationService, useGenerationsConfigService, useGenerationService, useUserService } from "../../services";
import useWebSocket from "react-use-websocket";
import { useToken } from "../../store/reducers/auth-reducer";
import { IoIosGitNetwork } from "react-icons/io";
import { FiSend } from "react-icons/fi";
import { firstLetterUpperCase } from "../../utils";
import { useLocation } from "react-router-dom";

export default function Inbox() {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const profile = useProfile();
  const token = useToken()
  const { getConversations, getConversationMessages } = useConversationService()
  const { getGenerationsConfig } = useGenerationsConfigService()
  const { getUsers } = useUserService()

  const { state } = useLocation()

  const viewport = useRef<HTMLDivElement>(null);
  const viewportUsers = useRef<HTMLDivElement>(null);
  const firstTime = useRef<boolean>(true)
  const page = useRef<number>(0)
  const users = useRef<User[]>([])
  const generators = useRef<User[]>([])

  const [conversations, setConversations] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [indexClick, setIndexClick] = useState<number | undefined>(state?._id ? undefined : 0)
  const [searchConversation, setSearchConversation] = useState<string>("")
  const [textMessage, setTextMessage] = useState<string>("")
  const [showSearchUsers, setShowSearchUsers] = useState<boolean>(state?._id || false)
  // const [generations, setGenerations] = useState<any[]>([])
  // const [users, setUsers] = useState<any[]>([])
  const [values, setValues] = useState<any>(state?._id ? [{ label: state.firstName, value: state._id }] : [])
  const [multiSelectData, setMultiSelectData] = useState<any>([])
  const [multiSelectDataFilter, setMultiSelectDataFilter] = useState<any>([])

  const { sendMessage } = useWebSocket(process.env.REACT_APP_WS_URL as string, {
    onOpen: () => {
      sendMessage(JSON.stringify({
        token
      }))
    },
    onMessage: (e) => {
      const res = JSON.parse(e.data)
      setValues([])

      switch (res.operation) {
        case "addMessage":
          if (res.data.message.createdBy._id === profile._id)
            setTextMessage("")

          const convIndex = conversations.map(c => c._id).indexOf(res.data._id)
          if (convIndex === indexClick) {
            setIndexClick(0)
            setMessages([...messages, res.data.message])
          }

          conversations[convIndex].messages.push(res.data.message)
          const tmp = { ...conversations[convIndex] }
          conversations.splice(convIndex, 1)
          conversations.unshift(tmp)
          setConversations([...conversations])

          viewport.current?.scrollTo({ top: viewport.current.scrollHeight })
          break
        case "conversationCreated":
          if (!indexClick || res.data.messages[0].createdBy._id === profile._id) {
            setTextMessage("")

            setMessages(res.data.messages)
            setIndexClick(0)
          }
          setConversations([res.data, ...conversations])
          break
        default:
          console.log(res)
      }
    }
  })

  useEffect(() => {
    getConversations({
      error: console.error,
      success: (res) => {
        res.forEach((c: any) => c.messages.sort((a: any, b: any) => a.date > b.date ? 1 : -1))
        setConversations(res)
        setMessages(state?._id ? [] : res[0].messages.sort((a: any, b: any) => a.date > b.date ? 1 : -1))
        viewport.current?.scrollTo({ top: viewport.current.scrollHeight })
      }
    })

    // getGenerationsConfig({
    //   error: console.error,
    //   success: (res) => setGenerations(Object.keys(res).map((obj: any, index: number) => ({ value: index, label: "Generation #" + (index) })))
    // })

    getUsers({
      error: console.error,
      success: (res) => {
        if (state?._id)
          setMessages([])

        res = res.filter((u: User) => u.username !== "Generation")
        users.current = res
        generators.current = res.filter((u: User) => u.level === 0)

        const data = [
          { value: 0, label: "Generation #0" },
          ...generators.current.map((u: any) => ({ value: u._id, label: u.firstName + " " + u.lastName + (u.generation ? " (#" + u.level + ")" : "") })).sort((a: any, b: any) => a.label > b.label ? 1 : -1)
        ]
        setMultiSelectData(data)
        setMultiSelectDataFilter(data)
      }
    }, {
      role: UserRoles.USER
    })
  }, [])

  function getMessageDifferenceDate(date: Date) {
    const diffInMinutes = Math.abs(differenceInMinutes(date, new Date()))
    if (diffInMinutes < 60)
      return diffInMinutes === 0 ? 1 + "min" : diffInMinutes + "min"
    else {
      const diffInHours = Math.abs(differenceInHours(date, new Date()))
      if (diffInHours < 24)
        return diffInHours + "h"
      else {
        const diffInDays = Math.abs(differenceInDays(date, new Date()))
        if (diffInDays < 31)
          return diffInDays + "j"
        else {
          const diffInMonth = Math.abs(differenceInMonths(date, new Date()))
          if (diffInMonth < 12)
            return diffInMonth + "mois"
          else {
            const diffInYears = Math.abs(differenceInYears(date, new Date()))
            return diffInYears <= 1 ? diffInYears + "an" : diffInYears + "ans"
          }
        }
      }
    }
  }

  const userAvatar = (user: User) => user.firstName &&
    <Avatar color={"dark"} radius="xl" style={{ zIndex: 0 }}> {user.firstName[0] + user.lastName[0]}</Avatar>

  const userMessage = (message: any, boxColor: string, textColor: string) =>
    <Paper p="md" style={{ wordBreak: "break-word", minWidth: "60%", backgroundColor: boxColor }}>
      <Text style={{ color: textColor }}>{message.text}</Text>
    </Paper>

  const Value =
    ({
      value,
      label,
      onRemove,
      classNames,
      ...others
    }: MultiSelectValueProps & { value: string }) =>
      <div {...others}>
        <Box
          sx={(theme) => ({
            display: 'flex',
            cursor: 'default',
            alignItems: 'center',
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[4]}`,
            paddingLeft: 10,
            borderRadius: 4,
          })}
        >
          {label.includes("Generation #") && <Box mr={10}>
            <IoIosGitNetwork size={14} style={{ transform: "rotate(180deg)" }} />
          </Box>}
          <Box sx={{ lineHeight: 1, fontSize: 12 }}>{label}</Box>
          <CloseButton
            onClick={() => {
              setValues([...values.filter((obj: any) => obj.value !== value)])
              setMultiSelectDataFilter([{ value, label }, ...multiSelectDataFilter].sort((a, b) => a.label > b.label ? 1 : -1))
            }}
            variant="transparent"
            size={22}
            iconSize={14}
            tabIndex={-1}
          />
        </Box>
      </div>

  interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    value: string
    label: string
  }

  const SelectItem = ({ value, label, ...others }: ItemProps) => (
    <div {...others}>
      <Group noWrap>
        {label.includes("Generation #") && <IoIosGitNetwork size={14} style={{ transform: "rotate(180deg)" }} />}
        <Text style={{ color: "black" }}>{label}</Text>
      </Group>
    </div>
  )

  function spreadMessage(firstUser: User, secondUser: User) {
    sendMessage(JSON.stringify({
      operation: "createConversation",
      users: [firstUser._id, secondUser._id],
      title: firstUser.firstName,
      message: textMessage
        .replaceAll("[nom]", secondUser.lastName)
        .replaceAll("[prénom]", secondUser.firstName)
        .replaceAll("[prenom]", secondUser.firstName),
      createdBy: firstUser._id
    }))
    console.log(secondUser.affiliatedUsers)
    secondUser.affiliatedUsers?.forEach((children: string) => {
      spreadMessage(secondUser, users.current.find(u => u._id === children) as any)
    })
  }

  return <>
    <div className={classes.rootContainer}>
      <Group position="apart">
        {/* title */}
        <Title order={2}>Inbox</Title>

        {/* new button */}
        <Button onClick={() => {
          if (showSearchUsers) {
            setValues([])
            setMultiSelectDataFilter([])
          }
          setMessages([])
          setShowSearchUsers(!showSearchUsers)
        }}>
          Nouveau
        </Button>
      </Group>

      <Group style={{ height: "100%" }} spacing="xl">
        {/* conversations list */}
        <ScrollArea style={{ height: window.innerHeight * 0.8, width: window.innerWidth * 0.2, gap: 0 }}>
          {/* search input */}
          <TextInput
            placeholder="Recherche"
            icon={<IoIosSearch size={14} />}
            onChange={(event) => setSearchConversation(event.currentTarget.value.toLowerCase())}
          />
          {conversations.map((conversation, index) => {
            const user = conversation.users.find((u: User) => u._id !== profile._id)

            return <Group
              key={conversation._id}
              style={{ backgroundColor: indexClick === index ? "#FFFFFF" : "" }}
              onClick={() => {
                setValues([])
                setShowSearchUsers(false)
                setIndexClick(index)
                setMessages(conversations[index].messages)
                setTimeout(() => {
                  viewport.current?.scrollTo({ top: viewport.current.scrollHeight })
                }, 0)
              }}
              p="sm"
              sx={{
                "&:hover": {
                  cursor: "pointer"
                }
              }}
            >
              <Avatar color="dark" radius="xl">{user.firstName[0] + user.lastName[0]}</Avatar>

              <Stack>
                <Group position="apart">
                  <Text
                    weight="bold"
                    style={{
                      width: window.innerWidth * 0.13,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: "black"
                    }}
                  >
                    {user.firstName + " " + user.lastName}
                  </Text>

                  <Text>{getMessageDifferenceDate(new Date(conversation.messages[conversation.messages.length - 1].date))}</Text>
                </Group>

                <Text
                  style={{
                    width: window.innerWidth * 0.15,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: "black"
                  }}
                >
                  {conversation.messages[conversation.messages.length - 1].text}
                </Text>
              </Stack>
            </Group>
          })}
        </ScrollArea>

        {/* messages list */}
        <ScrollArea
          p="xl"
          type="never"
          viewportRef={viewport}
          style={{ position: "relative", flex: 2, height: window.innerHeight * 0.8, borderStyle: "solid", borderWidth: 1, borderColor: "#EDF0F2", backgroundColor: "white" }}
          onScrollPositionChange={(position) => {
            if (position.y < 150 && firstTime.current) {
              firstTime.current = false
              page.current++

              getConversationMessages({
                error: console.error,
                success: (res) => {
                  firstTime.current = true
                  setMessages([...messages, ...res].sort(((a: any, b: any) => a.date > b.date ? 1 : -1)))
                }
              },
                conversations[indexClick || 0]._id,
                { page: page.current }
              )
            }
          }}
        >
          {/* header */}
          <Group p={20} style={{ zIndex: 1, width: "100%", position: "absolute", left: 0, top: 0, backgroundColor: "white" }}>
            {(() => {
              if (showSearchUsers)
                return <MultiSelect
                  searchable
                  style={{ flex: 1 }}
                  data={multiSelectData}
                  value={values.map((obj: any) => obj.value)}
                  valueComponent={Value}
                  itemComponent={SelectItem}
                  icon={<IoIosSearch size={14} />}
                  placeholder="Recherchez des utilisateurs ou des générations"
                  dropdownComponent={() =>
                    <ScrollArea
                      style={{ flex: 1 }}
                      type="always"
                      ref={viewportUsers}
                    >
                      {multiSelectDataFilter.map((obj: any) =>
                        <Stack
                          m="xs"
                          p="xs"
                          key={obj.value}
                          sx={{
                            "&:hover": {
                              cursor: "pointer",
                              backgroundColor: "#F6F7F9"
                            }
                          }}
                          style={{ borderRadius: 5 }}
                          onClick={() => {
                            setValues([...values, obj])
                            setMultiSelectDataFilter([...multiSelectDataFilter.filter((data: any) => data.value !== obj.value)])
                          }}
                        >
                          <Group style={{ gap: 5 }}>
                            {obj.label.includes("Generation #") && <IoIosGitNetwork size={14} style={{ transform: "rotate(180deg)" }} />}
                            <Text size="sm" style={{ color: "black" }}>{obj.label}</Text>
                          </Group>
                        </Stack>)
                      }
                    </ScrollArea>
                  }
                />
              else if (conversations.length) {
                const user = conversations[indexClick || 0].users.find((u: User) => u._id !== profile._id)

                return <Stack mx={10} style={{ width: "100%" }} spacing="xs">
                  <Group px={15}>
                    <Avatar color="dark" radius="xl" > {user.firstName[0] + user.lastName[0]}</Avatar>

                    <Stack style={{ gap: 0 }}>
                      <Text
                        weight="bold"
                        style={{
                          width: window.innerWidth * 0.13,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: "black"
                        }}
                      >
                        {user.firstName + " " + user.lastName}
                      </Text>

                      <Text size="sm">{
                        user.role === UserRoles.USER
                          ? "Client"
                          : firstLetterUpperCase(user.role)
                      }
                      </Text>
                    </Stack>
                  </Group>

                  <Divider color="#F1F3F5" />
                </Stack>
              }
              else
                return <></>
            })()}
          </Group>

          {/* messages list */}
          {
            messages.map((message, index) =>
              <Group
                key={message._id}
                position={message.createdBy._id === profile._id ? "right" : "left"}
                mt={80}
                mb={100}
              >
                {message.createdBy._id !== profile._id
                  ? <>
                    {userAvatar(message.createdBy)}
                    <Stack spacing="xs">
                      {userMessage(message, "#F6F7F9", "black")}
                      <Text size="xs">{new Date(message.date).toLocaleTimeString()}</Text>
                    </Stack>
                  </>
                  : <>
                    <Stack align="flex-end" spacing="xs">
                      {userMessage(message, "#2875DF", "white")}
                      <Text size="xs">{format(new Date(message.date), "dd MMMM HH:mm", { locale: fr })}</Text>
                    </Stack>

                    {userAvatar(message.createdBy)}
                  </>
                }
              </Group>
            )
          }

          {/* text input */}
          <Group p={20} style={{ width: "100%", position: "absolute", left: 0, bottom: 20, backgroundColor: "white" }}>
            <TextInput
              style={{ flex: 1 }}
              placeholder="Ecrivez ici..."
              value={textMessage}
              onChange={(event) => setTextMessage(event.currentTarget.value)}
            />
            <ActionIcon
              variant="filled"
              color="blue"
              size="lg"
              onClick={() => {
                if (textMessage) {
                  if (values.length) {
                    // spread the message
                    values.forEach((obj: any) => {
                      if (obj.label.includes("Generation #"))
                        generators.current.forEach((user: User) => spreadMessage(profile, user))
                      else
                        spreadMessage(profile, generators.current.find(u => u._id === obj.value) as any)
                    })
                  }
                  // already in a conversation
                  else
                    spreadMessage(profile, conversations[indexClick || 0].users.find((u: User) => u._id !== profile._id))
                }
              }}
            >
              <FiSend size={18} />
            </ActionIcon>
          </Group>
        </ScrollArea>
      </Group>
    </div >
  </>
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