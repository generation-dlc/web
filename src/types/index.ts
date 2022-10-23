import { ColorScheme } from "@mantine/core";

export type Activity = {
  time: number;
  date: string;
}

export type User = {
  _id: string;
  username: string;
  role: Roles;
  email: string;
  temporaryToken?: string;
  theme?: ColorScheme
}

export enum Roles {
  ADMIN = "ADMIN",
  EXTERNAL = "EXTERNAL",
  INTERNAL = "INTERNAL"
}

export type Config = {
  isDisabled: boolean;
}
