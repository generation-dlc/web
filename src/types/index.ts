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
  role: UserRoles;
  status: UserStatus;
  email: string;
  xp: number;
  balance: number;
  affiliatedUsers: User[] & string[];
  generation: { _id: string, number: number };
  note?: string;
  level?: number;
}

export enum UserRoles {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  USER = "USER"
}

export enum UserStatus {
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
  from?: User;
  to: User;
  actionId?: string;
  productId?: string;
  eventId?: string;
}

export enum TransactionType {
  ACTION = "ACTION",
  EVENT = "EVENT",
  PRODUCT = "PRODUCT",
}

export type Product = {
  _id: string;
  title: string;
  sponsor: string,
  price: string,
  points: number;
  xp?: number;
  start: string;
  end: string;
  used: number;
  stock: number;
  status: ProductStatus,
  imageUrl: string,
  description?: string
  category?: ProductCategory
}

export enum ProductStatus {
  ON = "ON",
  DRAFT = "DRAFT"
}

export enum ProductCategory {
  TRIP = "TRIP",
  DRINK = "DRINK",
  OTHERS = "OTHERS"
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
  description?: string;
  type: ActionTypeType;
}

export enum ActionStatus {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED"
}

export enum OperationType {
  ADD = "ADD",
  REMOVE = "REMOVE"
}

export enum ActionTypeType {
  SYSTEM = "SYSTEM",
  EXTERNAL = "EXTERNAL"
}

export type Config = {
  isDisabled: boolean;
}
