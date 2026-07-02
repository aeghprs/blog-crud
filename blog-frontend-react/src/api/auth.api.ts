import axios from "axios";

import api from "api/api";

import type { ILoginUser, IRegisterPayload } from "schema/auth";

import type {
  AuthResponse,
  RefreshResponse,
  RegisterResponse,
} from "types/types";

const BASE_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (data: ILoginUser) => {
  const response = await axios.post<AuthResponse>(
    `${BASE_URL}/auth/login`,
    data,
  );
  return response.data;
};

export const registerUser = async (data: IRegisterPayload) => {
  const response = await axios.post<RegisterResponse>(
    `${BASE_URL}/auth/register`,
    data,
  );
  return response.data;
};

export const refreshToken = async (token: string) => {
  const response = await axios.post<RefreshResponse>(
    `${BASE_URL}/auth/refresh`,
    {
      refreshToken: token,
    },
  );
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
