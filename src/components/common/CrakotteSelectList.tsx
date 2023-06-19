import { useEffect, useState } from 'react'
import { Text, Button, Group, Paper, ScrollArea, Stack, Title } from "@mantine/core"
import { useTranslation } from "react-i18next";
import { useIsDark } from "../../Root";

type CrakotteSelectList = {
  title: string;
  elements: any[];
  onSelect: (selectedElement: string) => void;
}

function CrakotteSelectList(props: CrakotteSelectList) {
  const { t } = useTranslation();
  const isDark = useIsDark();


  const [selectedElement, setSelectedElement] = useState<string>();

  useEffect(() => {
    setSelectedElement(undefined);
  }, [props.elements]);

  return <Paper p="xl" radius="xl" style={{ height: "100%" }}>
    <Stack align="stretch" sx={{ height: "100%" }}>
      <Group position="apart">
        <Title order={4}>{props.title}</Title>
        {/* <TextInput icon={<HiSearch size={18} />} /> */}
      </Group>

      <ScrollArea sx={{ flex: 1 }} offsetScrollbars>
        <Stack sx={{ width: "100%" }} spacing="xs">
          {
            props.elements.sort((a, b) => a.localeCompare(b)).map((name: string, i) =>
              <Button
                key={i}
                radius="lg"
                p="xs"
                sx={theme => ({
                  color: selectedElement === name ? theme.colors.white : isDark ? theme.colors.white : theme.colors.dark,
                  backgroundColor: selectedElement === name
                    ? isDark ? theme.colors.generation[7] : theme.colors.generation[6]
                    : isDark ? theme.colors.gray[8] : theme.colors.gray[2],
                  "&:hover": {
                    backgroundColor: selectedElement === name
                      ? isDark ? theme.colors.generation[8] : theme.colors.generation[7]
                      : isDark ? theme.fn.lighten(theme.colors.gray[9], 0.03) : theme.fn.darken(theme.colors.gray[3], 0.03)
                  }
                })}
                styles={{ label: { width: "100%", fontWeight: "normal" } }}
                onClick={() => setSelectedElement(name)}
              >
                <Text size="sm">{name}</Text>
              </Button>
            )
          }
        </Stack>
      </ScrollArea>
      <Button
        mt="auto"
        disabled={!selectedElement}
        sx={{ alignSelf: "flex-end" }}
        onClick={() => selectedElement && props.onSelect(selectedElement)}>
        {t("common.select")}
      </Button>
    </Stack>
  </Paper>
}

export default CrakotteSelectList