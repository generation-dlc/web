import axios, { AxiosRequestConfig } from "axios";
import { HttpMutators } from "../services/http-mutators";
import { useToken } from "../store/reducers/auth-reducer";
import { useClearStore } from "../store";
import { useNavigate } from "react-router-dom";

export type RequestParams = { payload?: any; } & Omit<AxiosRequestConfig, "data">;

const axiosRequest = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { "Content-Type": "application/json" }
});

export const useHttp = (baseSlug = "") => {
  const token = useToken();
  const clearStore = useClearStore();
  const navigate = useNavigate();

  const request = async (params = {} as any, { loading, error, success }: HttpMutators, options: { newToken: string, exec: boolean } = { newToken: "", exec: true }) => {
    loading && loading(true);
    params.url = `${baseSlug}${params.url || ""}`;

    if (options?.newToken || token) {
      params.headers = {
        ...params.headers,
        "Authorization": `Bearer ${options?.newToken || token}`
      }
    }
    else {
      // this method will automatically get a valid Azure AD token if not expired
      // const azureToken = await getAzureADToken();
      // if (azureToken) {
      //   params.headers = {
      //     ...params.headers,
      //     "Authorization": `Bearer ${azureToken}`
      //   }
      // }
    }

    return options?.exec
      ? axiosRequest({ ...params, data: params?.payload })
        .then(res => {
          success?.(res.data);
          loading?.(false);
          return res.data;
        })
        .catch(err => {
          // 401 status means the access token is potentially expired
          // therefore a refresh token request is made in order to
          // get a new token
          // if (err?.response?.status === 401 && refreshToken) {
          //   axiosRequest.post("/authentication/refresh-token", { refreshToken })
          //     .then(res => {
          //       saveToken(res.data);
          //       // remake the same request with updated access token
          //       request(params, { loading, error, success }, res.data.token);
          //     })
          //     .catch(err => {
          //       if (err.response.status === 401) {
          //         removeToken();
          //       }
          //       else {
          //         error && error(err.response?.data);
          //         loading && loading(false);
          //       }
          //     });
          // }
          if (params.url !== "/sign-in" && err?.response?.status === 401) {
            clearStore();
            navigate("/sign-in", { replace: true });
          }
          else {
            // console.log(error)
            // error && error({ status: err?.response?.status, ...err.response?.data });
            // loading && loading(false);
          }
        })
      : axiosRequest({ ...params, data: params?.payload })
  }

  return {
    get: (mutators: HttpMutators, params?: RequestParams | null, options?: any) =>
      request({ ...params, method: "GET" }, mutators, options),
    post: (mutators: HttpMutators, params?: RequestParams | null, options?: any) =>
      request({ ...params, method: "POST" }, mutators, options),
    patch: (mutators: HttpMutators, params?: RequestParams | null, options?: any) =>
      request({ ...params, method: "PATCH" }, mutators, options),
    remove: (mutators: HttpMutators, params?: RequestParams | null, options?: any) =>
      request({ ...params, method: "DELETE" }, mutators, options)
  }
}