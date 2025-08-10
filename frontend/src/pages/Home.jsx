import Header from "../components/Header.jsx";
import Editor from "../components/MDeditor.jsx";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";

export default function Home() {
  const [isSidebar, setIsSidebar] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [note, setNote] = useState(null);

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
        setIsSidebar={setIsSidebar}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />
      <main className="flex min-h-screen">
        <div
          className={`${
            isSidebar ? "w-64" : "w-0"
          } transition-width duration-300 ease-in-out overflow-hidden`}
        >
          <Sidebar setNote={setNote} />
        </div>
        <div className="w-full mas-w-4xl">
          <Editor note={note} setNote={setNote} />
        </div>
      </main>
    </div>
  );
}
