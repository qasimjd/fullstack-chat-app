import { create } from "zustand";

const useThemeStore = create((set) => ({
    theme: localStorage.getItem("chat-theme") || "Pastel",
    setTheme: (theme) => {
        localStorage.setItem("chat-theme", theme);
        set({ theme });
    }
}));

export default useThemeStore;