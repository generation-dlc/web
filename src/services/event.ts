import { HttpMutators } from "./http-mutators";
import { useHttp } from "./http";

export const useEventService = () => {
  const { get, post, patch } = useHttp("/events");

  return {
    getEvents: (mutators: HttpMutators, params?: any) =>
      get(mutators, { params }),
    addEvent: (mutators: HttpMutators, payload: any) =>
      post(mutators, {
        headers: { "Content-Type": "multipart/form-data" },
        payload
      }),
    editEvent: (mutators: HttpMutators, id: string, payload: any) =>
      patch(mutators, {
        url: `/${id}`,
        headers: { "Content-Type": "multipart/form-data" },
        payload
      })
  }
}