import { HttpMutators } from "./http-mutators";
import { useHttp } from "./http";

export const useGenerationService = () => {
  const { get, post, patch } = useHttp("/generations");

  return {
    getGenerations: (mutators: HttpMutators, params?: any) =>
      get(mutators, { params }),
    addGeneration: (mutators: HttpMutators, payload: any) =>
      post(mutators, { payload }),
    editGeneration: (mutators: HttpMutators, id: string, payload: any) =>
      patch(mutators, { url: `/${id}`, payload }),
    getLeaderboard: (mutators: HttpMutators) =>
      get(mutators, { url: "/leaderboard" })
  }
}