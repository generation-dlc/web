import { HttpMutators } from "./http-mutators";
import { useHttp } from "./http";
import { UserRoles } from "../types";

export type ChangePasswordPayload = {
  newPassword: string;
}

export const useUserService = () => {
  const { get, post, patch } = useHttp("/users");

  return {
    getUsers: (mutators: HttpMutators, params?: any) =>
      get(mutators, { url: "/all", params }),
    getUsersByProperty: (mutators: HttpMutators, payload: any, params?: any) =>
      post(mutators, { url: "/property", payload, params }),
    getProfile: (mutators: HttpMutators) =>
      get(mutators, { url: "/who-am-i" }),
    updateCurrentUser: (mutators: HttpMutators, payload: any) =>
      patch(mutators, { payload }),
    updateUser: (mutators: HttpMutators, id: string, payload: any) =>
      patch(mutators, { url: `/${id}`, payload }),
  }
}