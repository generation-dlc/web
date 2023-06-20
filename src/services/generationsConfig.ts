import { HttpMutators } from "./http-mutators";
import { useHttp } from "./http";

export const useGenerationsConfigService = () => {
  const { get, patch } = useHttp("/generations-config");

  return {
    getGenerationsConfig: (mutators: HttpMutators) =>
      get(mutators),
    editGenerationsConfig: (mutators: HttpMutators, payload: any) =>
      patch(mutators, { payload })
  }
}