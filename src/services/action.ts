import { HttpMutators } from "./http-mutators";
import { useHttp } from "./http";

export const useActionService = () => {
  const { get, post, patch } = useHttp("/actions");

  return {
    getActions: (mutators: HttpMutators, params?: any) =>
      get(mutators, { params: { params } }),
    addAction: (mutators: HttpMutators, payload: any) =>
      post(mutators, { payload }),
    editAction: (mutators: HttpMutators, id: string, payload: any) =>
      patch(mutators, { url: `/${id}`, payload })
  }
}