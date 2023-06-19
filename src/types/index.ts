import { ColorScheme } from "@mantine/core";

export type Activity = {
  time: number;
  date: string;
}

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber?: string;
  dob?: string;
  country?: string;
  city?: string;
  zip?: number;
  lastActivity: string;
  inscriptionDate: string;
  role: Roles;
  status: Status;
  email: string;
  xp: number;
  balance: number;
  generation: { _id: string, number: number };
  note?: string;
  level?: number;
}

export enum Roles {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  USER = "USER"
}

export enum Status {
  ON = "ON",
  OFF = "OFF",
  BAN = "BAN"
}

export type Transaction = {
  _id: string;
  type: TransactionType;
  date: string;
  description: string;
  points: number;
  xp?: number;
  from?: { firstName: string, lastName: string, role: Roles };
  to: { firstName: string, lastName: string, role: Roles };
  actionId?: string;
  productId?: string;
  eventId?: string;
}

export enum TransactionType {
  ACTION = "ACTION",
  EVENT = "EVENT",
  PRODUCT = "PRODUCT",
}

export type Gift = {
  _id: string;
  type: GiftType;
  title: string;
  sponsor: string,
  price: number;
  xp?: number;
  start: string;
  end: string;
  used: number;
  stock: number;
  status: GiftStatus,
  imageUrl: string,
  description?: string
}

export enum GiftType {
  GOODBUY = "GOODBUY",
  OFFER = "OFFER"
}

export enum GiftStatus {
  ON = "ON",
  DRAFT = "DRAFT"
}

export type Event = {
  _id: string;
  date: string;
  title: string;
  place: string;
  imageUrl: string;
  points: number;
  price: number;
  participants: { firstName: string, lastName: string, username: string }[];
  status: EventStatus;
  description?: string
}

export enum EventStatus {
  PUBLISHED = "PUBLISHED",
  DRAFT = "DRAFT"
}

export type Action = {
  _id: string;
  title: string;
  operationType: OperationType;
  points: number;
  xp: number;
  status: ActionStatus;
  description?: string
}

export enum ActionStatus {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED"
}

export enum OperationType {
  ADD = "ADD",
  REMOVE = "REMOVE"
}

export type Config = {
  isDisabled: boolean;
}
