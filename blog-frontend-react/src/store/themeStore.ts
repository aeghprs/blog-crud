import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeMode = "dark" | "light";

interface ThemeState {
  theme: ThemeMode;
  toggle: () => void;
  apply: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: window.matchMedia?.("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
      toggle() {
        const next: ThemeMode = get().theme === "dark" ? "light" : "dark";
        set({ theme: next });
        document.documentElement.classList.toggle("dark", next === "dark");
      },
      apply() {
        document.documentElement.classList.toggle(
          "dark",
          get().theme === "dark",
        );
      },
    }),
    { name: "blogapp_theme" },
  ),
);
