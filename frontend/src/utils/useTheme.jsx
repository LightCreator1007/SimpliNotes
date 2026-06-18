import { useEffect } from "react";

export default function useTheme() {
  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
}
