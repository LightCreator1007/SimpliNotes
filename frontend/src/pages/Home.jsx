import Header from "../components/Header.jsx";
import Editor from "../components/MDeditor.jsx";
import { useEffect, useState } from "react";

export default function Home() {
  const [isSidebar, setIsSideBar] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="flex flex-col min-h-screen gap-3 bg-gray-50 scroll-smooth">
      <Header
        isSidebar={isSidebar}
        setIsSideBar={setIsSideBar}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <main className="flex min-h-screen">
        <div className="w-full mas-w-4xl">
          <Editor />
        </div>
      </main>
    </div>
  );
}
