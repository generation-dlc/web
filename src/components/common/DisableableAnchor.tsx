import { Anchor, AnchorProps } from "@mantine/core";

const DisableableAnchor = (props: AnchorProps & { children: any, disabled?: boolean } & any) => {
  return (
    <Anchor
      {...props}
      onClick={(e: any) => (props.disabled ? e.preventDefault() : null)}
      sx={theme =>
        props.disabled
          ? { ...props.sx, cursor: "not-allowed", color: theme.fn.lighten(theme.colors.crakotte[7], 0.5) }
          : { ...props.sx } as any
      }>
      {props.children}
    </Anchor>
  );
};

export default DisableableAnchor;
