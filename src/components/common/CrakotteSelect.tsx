import { Select, SelectProps } from "@mantine/core";
import { useIsDark } from "../../Root";

function CrakotteSelect(props: SelectProps) {
  const isDark = useIsDark();

  return <Select
    {...props}
    transition="pop"
    transitionDuration={150}
    transitionTimingFunction="ease"
    styles={theme => ({
      item: {
        borderRadius: "0.75rem",
        marginBottom: 4,
        "&:last-of-type": {
          marginBottom: 0,
        },
      },
      input: {
        "&:active": { transform: "translateY(1px)" },
        userSelect: "none",
        borderRadius: "0.75rem",
        border: `2px solid ${isDark ? theme.colors.gray[7] : theme.colors.gray[4]} !important`,
        backgroundColor: "transparent",
      },
    })}
  />
}

export default CrakotteSelect
