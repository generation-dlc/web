import { HttpMutators } from "./http-mutators";
import { useHttp } from "./http";


export type ConfigPayload = {
  isDisabled: boolean;
};

export const useConfigService = () => {
  const { get, patch } = useHttp("/config");

  return {
    getConfig: (mutators: HttpMutators) => get(mutators),
    editConfig: (mutators: HttpMutators, payload: ConfigPayload) => patch(mutators, { payload })
  }
}