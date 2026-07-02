import axios from "axios";
import { type AxiosRequestConfig } from "axios";

import { refreshToken } from "./auth.api";

const BASE_URL = import.meta.env.VITE_API_URL;

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      window.location.href = "/login";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      console.log("Session expired. Calling /refresh...");

      try {
        const refreshTokenVal = localStorage.getItem("refreshToken");

        if (!refreshTokenVal) throw new Error();
        const response = await refreshToken(refreshTokenVal);

        const newAccessToken = response.accessToken;
        const newRefreshToken = response.refreshToken;
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        return api(originalRequest);
      } catch (err) {
        console.error("Refresh failed, redirecting to login", err);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
