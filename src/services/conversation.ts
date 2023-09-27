import { HttpMutators } from "./http-mutators";
import { useHttp } from "./http";

export type ChangePasswordPayload = {
  newPassword: string;
}

export const useConversationService = () => {
  const { get } = useHttp("/conversations");

  return {
    getConversations: (mutators: HttpMutators, params?: any) =>
      get(mutators, { params }),
    getConversationMessages: (mutators: HttpMutators, id: string, params?: any) =>
      get(mutators, { url: `/${id}/messages`, params })
  }
}