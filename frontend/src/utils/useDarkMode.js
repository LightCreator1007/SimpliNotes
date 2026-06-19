import { useState, useEffect, useCallback } from "react";

// Single source of truth for the theme. The .dark class is applied to
// <html> before paint by an inline script in index.html, so this hook
// only keeps React state in sync and persists changes.
function readStored() {
  try {
    return localStorage.getItem("darkMode") === "true";
  } catch {
    return false;
  }
}

export default function useDarkMode() {
  const [isDark, setIsDark] = useState(readStored);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try {
      localStorage.setItem("darkMode", String(isDark));
    } catch {
      /* storage unavailable; theme still applies for this session */
    }
  }, [isDark]);

  const toggle = useCallback(() => setIsDark((d) => !d), []);

  return [isDark, toggle, setIsDark];
}
