import { HttpMutators } from "./http-mutators";
import { useHttp } from "./http";

export const useServiceService = () => {
  const { post, patch } = useHttp();

  return {
    sendEmails: (mutators: HttpMutators, payload: any) =>
      post(mutators, { url: "/send-emails", payload }),
  }
}