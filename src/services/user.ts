import { HttpMutators } from "./http-mutators";
import { useHttp } from "./http";
import { Roles } from "../types";

export type ChangePasswordPayload = {
  newPassword: string;
}

export type AddUserPayload = {
  firstName: string,
  lastName: string,
  role: Roles,
  email: string,
}

export const useUserService = () => {
  const { get, post, patch } = useHttp("/users");

  return {
    getUsers: (mutators: HttpMutators) => get(mutators),
    createUser: (mutators: HttpMutators, payload: any) => post(mutators, { payload }),
    getProfile: (mutators: HttpMutators) => get(mutators, { url: "/who-am-i" }),
    updateCurrentUser: (mutators: HttpMutators, payload: any) => patch(mutators, { payload }),
    updateUser: (mutators: HttpMutators, id: string, payload: any) => patch(mutators, { url: `/${id}`, payload }),
    createUserEntry: (mutators: HttpMutators, userId: string, payload: any) =>
      post(mutators, { url: `/${userId}/entries`, payload }),
    getCurrentUserEntries: (mutators: HttpMutators, query?: any) =>
      get(mutators, { url: "/entries", params: query }),
    getUserEntries: (mutators: HttpMutators, userId: string, query?: any) =>
      get(mutators, { url: `/${userId}/entries`, params: query }),
  }
}