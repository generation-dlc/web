import { useMantineTheme, Text, Stack } from "@mantine/core";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { HiDocumentText } from "react-icons/hi";
import { useIsDark } from "../../Root";

function CrakotteLoader(props: any) {
  const theme = useMantineTheme();
  const { t } = useTranslation();

  const isDark = useIsDark();
  const color = useMemo(() => isDark ? theme.colors.generation[7] : theme.colors.generation[6], [isDark]);

  return (
    <Stack justify="center" spacing={5} align="center" {...props}>
      <HiDocumentText size={30} className="float" color={color} />
      <Text className="bounceIn" size="sm" weight="bold" sx={{ textTransform: "uppercase" }} color={color}>{t("common.loading")}</Text>
    </Stack>
  )
}

export default CrakotteLoader