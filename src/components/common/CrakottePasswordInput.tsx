import { useState } from 'react';
import { PasswordInput, Progress, Text, Popover, Box, useMantineTheme, PasswordInputProps } from '@mantine/core';
import { HiCheck, HiEye, HiEyeOff, HiLockClosed, HiX } from "react-icons/hi";
import { useTranslation } from "react-i18next";

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
  const { t } = useTranslation();

  return (
    <Text
      color={meets ? "teal" : "red"}
      sx={{ display: "flex", alignItems: "center" }}
      mt={7}
      size="sm"
    >
      {meets ? <HiCheck /> : <HiX />} <Box ml={10}>{t(label)}</Box>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: "form.includesNumber" },
  { re: /[a-z]/, label: "form.includesLowercaseLetter" },
  { re: /[A-Z]/, label: "form.includesUppercaseLetter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "form.includesSpecialSymbol" },
];

function getStrength(password: string) {
  if (!password)
    return 0;

  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach(r => {
    if (!r.re.test(password))
      multiplier += 1;
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

export default function CrakottePasswordInput({ withRules, ...props }: PasswordInputProps & { withRules?: boolean }) {
  const theme = useMantineTheme();
  const { t } = useTranslation();

  const [popoverOpened, setPopoverOpened] = useState(false);

  let strength;
  let color;

  if (withRules) {
    strength = getStrength(props?.value as string);
    color = strength === 100 ? "crakotte" : strength > 50 ? "yellow" : "red";
  }

  const passwordInput =
    <PasswordInput
      description={withRules ? t("form.passwordRules") : null}
      icon={<HiLockClosed />}
      visibilityToggleIcon={({ reveal, size }) =>
        reveal
          ? <HiEyeOff size={size} color={theme.colors.gray[6]} />
          : <HiEye size={size} color={theme.colors.gray[6]} />
      }
      {...props}
    />

  return withRules
    ? <Popover
      opened={popoverOpened}
      position="bottom-start"
      withArrow
      radius="lg"
      styles={{ dropdown: { width: "100%" }, arrow: { left: "20px !important" } }}
      trapFocus={false}
      transition="pop-top-left"
      onOpen={() => setPopoverOpened(true)}
      onClose={() => setPopoverOpened(false)}
    >
      <Popover.Target>{passwordInput}</Popover.Target>
      <Popover.Dropdown>
        <Progress color={color} value={strength} size={5} mb={10} />
        <PasswordRequirement label="form.includesAtLeast6Characters" meets={(props?.value as string)?.length > 5} />

        {requirements.map((requirement, index) => (
          <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(props?.value as string)} />
        ))}
      </Popover.Dropdown>
    </Popover>
    : passwordInput
}