import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("Masterlingo-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("Masterlingo-theme", theme);
    set({ theme });
  },
}));
