import { HttpMutators } from "./http-mutators";
import { useHttp } from "./http";

export type SignInPayload = {
  email: string;
  password: string;
}

export type RequestPasswordPayload = {
  email: string;
}

export type ResetPasswordPayload = {
  token: string;
  userId: string;
  password: string;
}

export const useAuthService = () => {
  const { post } = useHttp();

  return {
    signIn: (mutators: HttpMutators, payload: SignInPayload) => post(mutators, {
      url: "/sign-in-admin",
      payload
    }),
    requestPasswordReset: (mutators: HttpMutators, payload: RequestPasswordPayload) => post(mutators, {
      url: "/request-password",
      payload
    }),
    resetPassword: (mutators: HttpMutators, payload: ResetPasswordPayload) => post(mutators, {
      url: "/reset-password",
      payload
    }),
  }
}