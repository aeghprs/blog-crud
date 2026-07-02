import type { User } from "types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const getStoredToken = (key: string) => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
};

const setToken = (key: string, value: string) => {
  if (typeof window === "undefined") return null;
  return localStorage.setItem(key, value);
};

export const isAuthenticated = () => {
  const state = useAuthStore.getState();
  return Boolean(state.user || state.accessToken);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: getStoredToken("accessToken"),
      refreshToken: getStoredToken("refreshToken"),

      setUser(user) {
        set({ user });
      },

      setTokens(accessToken, refreshToken) {
        set({ accessToken, refreshToken });

        if (typeof window !== "undefined") {
          if (accessToken) {
            setToken("accessToken", accessToken ?? "");
          } else {
            localStorage.removeItem("accessToken");
          }

          if (refreshToken) {
            setToken("refreshToken", refreshToken ?? "");
          } else {
            localStorage.removeItem("refreshToken");
          }
        }
      },

      logout() {
        set({ user: null, accessToken: null, refreshToken: null });
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      },

      isAuthenticated() {
        return Boolean(get().user && get().accessToken);
      },
    }),
    {
      name: "blogapp",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
