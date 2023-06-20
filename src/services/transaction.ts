import { HttpMutators } from "./http-mutators";
import { useHttp } from "./http";
import { UserRoles } from "../types";

export const useTransactionService = () => {
  const { get, post } = useHttp("/transactions");

  return {
    getTransactions: (mutators: HttpMutators, params?: any) =>
      get(mutators, { params: { ...params, simple: true } }),
    getTransactionsByProperty: (mutators: HttpMutators, payload: any, params?: any) =>
      post(mutators, { url: "/property", payload, params }),
    getTransactionCommission: (mutators: HttpMutators, id: string, params?: any) =>
      get(mutators, { url: `/${id}/commissions`, params }),
  }
}