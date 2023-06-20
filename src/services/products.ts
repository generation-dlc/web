import { HttpMutators } from "./http-mutators";
import { useHttp } from "./http";

export const useProductService = () => {
  const { post, patch } = useHttp("/products");

  return {
    getProductsByProperty: (mutators: HttpMutators, payload: any, params?: any) =>
      post(mutators, { url: "/property", payload, params }),
    addProduct: (mutators: HttpMutators, payload: any) =>
      post(mutators, {
        headers: { "Content-Type": "multipart/form-data" },
        payload
      }),
    editProduct: (mutators: HttpMutators, id: string, payload: any) =>
      patch(mutators, {
        url: `/${id}`,
        headers: { "Content-Type": "multipart/form-data" },
        payload
      })
  }
}