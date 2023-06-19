import { HttpMutators } from "./http-mutators";
import { useHttp } from "./http";
import { UserRoles } from "../types";

export type ChangePasswordPayload = {
  newPassword: string;
}

export type AddUserPayload = {
  firstName: string,
  lastName: string,
  role: UserRoles,
  email: string,
}

export const useUserService = () => {
  const { get, post, patch } = useHttp("/users");

  return {
    getUsers: (mutators: HttpMutators) =>
      get(mutators),
    getProfile: (mutators: HttpMutators) =>
      get(mutators, { url: "/who-am-i" }),
    updateCurrentUser: (mutators: HttpMutators, payload: any) =>
      patch(mutators, { payload }),
    updateUser: (mutators: HttpMutators, id: string, payload: any) =>
      patch(mutators, { url: `/${id}`, payload }),
  }
}