import { useEffect, useRef, useState } from "react";
import { createStyles, Group, Stack, Text, Pagination, ActionIcon, Title, Select, TextInput, Box, Paper, Table, Badge, Avatar, Image, Grid, Modal, Tabs, Textarea, Button } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { DateRangePicker } from "@mantine/dates";
import { Event, EventStatus } from "../../types";
import isSameMonth from 'date-fns/isSameMonth'
import { format, getMonth, getYear } from "date-fns";
import { fr } from "date-fns/locale";
import { getMonthName } from "../../utils";
import { FiChevronDown, FiX } from 'react-icons/fi';
import { useEventService } from "../../services";

export default function Events() {
  const { t } = useTranslation();
  const { classes } = useStyles();
  const { getEvents, addEvent, editEvent } = useEventService();

  const inputFile: any = useRef()

  const [events, setEvents] = useState<any[]>([])
  const [selectedRangeDate, setSelectedRangeDate] = useState<any>([])
  const [when, setWhen] = useState<any>([])
  const [showEventModal, setShowEventModal] = useState<boolean>(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | any>()
  const [selectedEventParticipantsRows, setSelectedEventParticipantsRows] = useState([])

  useEffect(() => {
    getEvents({
      error: console.error,
      success: (res) => setEvents(groupByMonth(res))
    }, {
      when,
      ...(selectedRangeDate.filter((date: any) => date).length === 2 &&
        { periode: true, start: selectedRangeDate[0], end: selectedRangeDate[1] })
    })
  }, [when, selectedRangeDate])

  useEffect(() => {
    setSelectedEventParticipantsRows(selectedEvent?.participants?.map((user: { firstName: string, lastName: string, username: string }, index: number) => (
      <tr key={index} style={{ position: "relative" }}>
        <td>{user.firstName + " " + user.lastName}</td>
        <td>@{user.username}</td>
      </tr>
    )))
  }, [selectedEvent])

  function groupByMonth(res: any) {
    res.sort((a: any, b: any) => a.date > b.date ? 1 : -1)

    // group by months
    const groupByMonth: any = []
    let i: number = 0

    res.forEach((event: Event, index: number) => {
      if (!groupByMonth[i])
        groupByMonth[i] = []
      groupByMonth[i].push(event)

      if (!isSameMonth(new Date(event.date), new Date(res[index + 1]?.date)))
        i++
    })

    return groupByMonth
  }

  const synteticEvent = new MouseEvent("mousedown", {
    view: window,
    bubbles: true,
    cancelable: true,
  })

  return <div className={classes.rootContainer}>
    {/* title */}
    <Title order={2}>Evenements</Title>

    {/* filters */}
    <Group position="apart">
      <Group>
        <Select
          defaultValue={"after"}
          data={[
            { value: "after", label: "A venir" },
            { value: "before", label: "Passés" },
          ]}
          onChange={(value) => setWhen(value as string)}
        />

        <DateRangePicker
          placeholder="Date de ... à"
          onChange={setSelectedRangeDate}
        />
      </Group>

      <Group>
        {/* <Text
          style={{ color: "#3C8CE4" }}
          sx={{
            "&:hover": {
              cursor: "pointer"
            }
          }}
          onClick={() => { }}
        >
          Exporter
        </Text> */}
        <Button onClick={() => { setSelectedEvent({}); setShowEventModal(true) }}>Nouveau</Button>
      </Group>
    </Group>


    {/* body */}
    {events.map((eventsByMonth, index) =>
      <Paper
        key={index}
        p="xl"
        shadow="xs"
        style={{ borderRadius: 10, borderStyle: "solid", borderWidth: 1, borderColor: "#EDF0F2", backgroundColor: "white" }}
      >
        <Title order={2}>{getMonthName(getMonth(new Date(eventsByMonth[0].date)))} {getYear(new Date(eventsByMonth[0].date))}</Title>
        {eventsByMonth.map((event: Event) =>
          <Grid
            key={event._id}
            mt="xl"
            sx={{
              "&:hover": {
                cursor: "pointer"
              }
            }}
            onClick={(e) => {
              // @ts-ignore
              if (!(e.target.toString().includes("SVGSVGElement") || e.target.toString().includes("HTMLInputElement"))) {
                setSelectedEvent(event)
                setShowEventModal(true)
              }
            }}
          >
            <Grid.Col span={3}>
              <Image
                radius="sm"
                width={"100%"}
                src={event.imageUrl}
                alt={event.imageUrl}
              />
            </Grid.Col>

            <Grid.Col span={"auto"} style={{ display: "flex", alignItems: "center" }}>
              <Group position="apart" style={{ width: "100%" }} pr="xl">
                <Stack ml="xl" spacing="xs">
                  {/* <Title order={2} style={{ color: "grey" }}>{format(new Date(event.date), "EEEE dd MMMM yyyy", { locale: fr })}</Title> */}
                  <Title order={2}>{event.title}</Title>
                  <Title order={5}>{event.place}</Title>
                  <Title order={5} style={{ color: "grey" }}>{event.participants.length} participants</Title>
                </Stack>

                <Select
                  value={event.status}
                  data={[
                    { value: EventStatus.PUBLISHED, label: "Publié" },
                    { value: EventStatus.DRAFT, label: "Brouillon" },
                  ]}
                  sx={{
                    input: {
                      width: event.status === EventStatus.PUBLISHED ? 120 : 140,
                      backgroundColor: event.status === EventStatus.PUBLISHED ? "#E1F3FF" : "#F6F7F9",
                      color: event.status === EventStatus.PUBLISHED ? "#2875DF" : "#7A828B",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      borderWidth: 0,
                      paddingLeft: "15%"
                    },
                    item: {
                      fontWeight: "bold",
                    }
                  }}
                  rightSection={<FiChevronDown size={18} color="#2875DF" />}
                  onChange={(value) => {
                    // @ts-ignore
                    event.status = value;

                    editEvent({
                      error: console.error,
                      success: () => setEvents([...events])
                    }, event._id, event)
                  }}
                />
              </Group>
            </Grid.Col>
          </Grid>
        )}
      </Paper>
    )}

    {/* create/edit event modal */}
    <Modal
      opened={showEventModal}
      onClose={() => setShowEventModal(false)}
      title={<Title order={4}>Fiche Evenement</Title>}
      withCloseButton={false}
      styles={{ modal: { minWidth: 600 }, title: { padding: 10, paddingTop: 0 }, body: { padding: 10 } }}
      overflow="outside"
    >
      {/* close button */}
      <ActionIcon
        variant="transparent"
        style={{ position: "absolute", top: "3%", right: "3%" }}
        onClick={() => setShowEventModal(false)}
      >
        <FiX size={18} color="gray" />
      </ActionIcon>

      <Tabs defaultValue="details">
        <Tabs.List>
          <Tabs.Tab style={{ width: "33%" }} value="details">Détails</Tabs.Tab>
          <Tabs.Tab style={{ width: "33%" }} value="participants">Participants</Tabs.Tab>
          <Tabs.Tab style={{ width: "33%" }} value="shares">Partages</Tabs.Tab>
        </Tabs.List>

        {/* event info */}
        <Tabs.Panel value="details" pt="xl">
          <Stack align="stretch" sx={{ height: "100%" }}>
            {/* image && title && type */}
            <Grid>
              <Grid.Col span={4} style={{ display: "flex", alignItems: "center" }}>
                <input
                  id="file"
                  type="file"
                  ref={inputFile}
                  style={{ display: "none" }}
                  accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                  onChange={(event) => {
                    event.stopPropagation()
                    event.preventDefault()

                    // @ts-ignore
                    selectedEvent.file = event.target.files[0]

                    var reader = new FileReader();
                    reader.onload = function (event) {
                      // @ts-ignore
                      selectedEvent.imageUrl = event.target.result
                      setSelectedEvent({ ...selectedEvent })
                    };

                    // @ts-ignore
                    reader.readAsDataURL(event.target.files[0])
                  }}
                />
                <div
                  style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 10, width: "100%", height: "100%", backgroundColor: selectedEvent?._id ? "" : "#C3CAD1", cursor: "pointer" }}
                  onClick={() => inputFile.current?.click()}
                  role="presentation"
                >
                  {!selectedEvent?.imageUrl
                    ? <Text style={{ color: "black", fontSize: 30 }}>+</Text>
                    : <img
                      src={selectedEvent?.imageUrl}
                      alt={selectedEvent?.imageUrl}
                      style={{ width: "100%", borderRadius: 10 }}
                    />
                  }
                </div>
              </Grid.Col>

              <Grid.Col span={"auto"}>
                <Stack align="stretch" style={{ height: "100%", width: "100%" }}>
                  <TextInput
                    required
                    id="title"
                    label="Titre"
                    onChange={(event) => setSelectedEvent({ ...selectedEvent, title: event.currentTarget.value })}
                    value={selectedEvent?.title}
                  />

                  <TextInput
                    id="dob"
                    label="Date"
                    type="date"
                    onChange={(event) => setSelectedEvent({ ...selectedEvent, date: event.currentTarget.value })}
                    value={selectedEvent?.date && format(new Date(selectedEvent?.date), "yyyy-MM-dd")}
                  />
                </Stack>
              </Grid.Col>
            </Grid>

            {/* place && points && price */}
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  required
                  id="place"
                  label="Lieu"
                  onChange={(event) => setSelectedEvent({ ...selectedEvent, place: event.currentTarget.value })}
                  value={selectedEvent?.place}
                />
              </Grid.Col>

              <Grid.Col span={"auto"}>
                <TextInput
                  required
                  id="points"
                  label="Prix (Points)"
                  onChange={(event) => setSelectedEvent({ ...selectedEvent, points: event.currentTarget.value })}
                  value={selectedEvent?.points}
                />
              </Grid.Col>

              <Grid.Col span={"auto"}>
                <TextInput
                  required
                  id="price"
                  label="Prix (€)"
                  onChange={(event) => setSelectedEvent({ ...selectedEvent, price: event.currentTarget.value })}
                  value={selectedEvent?.price}
                />
              </Grid.Col>
            </Grid>

            {/* description */}
            <Textarea
              placeholder="Ecrivez ici..."
              label="Description"
              maxRows={4}
              onChange={(event) => setSelectedEvent({ ...selectedEvent, description: event.currentTarget.value })}
              value={selectedEvent?.description}
            />
          </Stack>
        </Tabs.Panel>

        {/* event participants info */}
        <Tabs.Panel value="participants" pt="xl">
          {/* table */}
          <Table mt={"xl"}>
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Identifiant</th>
              </tr>
            </thead>
            <tbody>{selectedEventParticipantsRows}</tbody>
          </Table>
        </Tabs.Panel>

        {/* event shares */}
        <Tabs.Panel value="shares" pt="xl">

        </Tabs.Panel>

        {/* action buttons */}
        <Group position="right" mt="xl">
          <Text
            style={{ color: "black" }}
            sx={{
              "&:hover": {
                cursor: "pointer"
              }
            }}
            onClick={() => setShowEventModal(false)}
          >
            Annuler
          </Text>
          <Button
            onClick={() => {
              const formData = new FormData()

              for (const key in selectedEvent)
                // @ts-ignore
                formData.append(key, selectedEvent[key])

              if (selectedEvent._id)
                editEvent({
                  error: console.error,
                  success: (res) => {
                    for (let i = 0; i < events.length; i++) {
                      for (let x = 0; x < events[i].length; x++) {
                        if (events[i][x]._id === res._id) {
                          events[i][x] = res
                          setEvents([...events])
                          setShowEventModal(false)
                          break
                        }
                      }
                    }
                  }
                }, selectedEvent._id, selectedEvent)
              else
                addEvent({
                  error: console.error,
                  success: (res) => {
                    const tmpLs = []
                    for (let i = 0; i < events.length; i++) {
                      for (let x = 0; x < events[i].length; x++) {
                        tmpLs.push(events[i][x])
                      }
                    }
                    tmpLs.push(res)

                    setEvents(groupByMonth(tmpLs))
                    setShowEventModal(false)
                  }
                }, selectedEvent)
            }}
          >
            Sauvegarder
          </Button>
        </Group>
      </Tabs>
    </Modal>
  </div>
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