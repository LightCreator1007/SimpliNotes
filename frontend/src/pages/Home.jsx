import Header from "../components/Header.jsx";
import Editor from "../components/MDeditor.jsx";
import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import useDarkMode from "../utils/useDarkMode.js";
import useMediaQuery from "../utils/useMediaQuery.js";

export default function Home() {
  const [isDark, toggleTheme] = useDarkMode();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isSidebar, setIsSidebar] = useState(isDesktop);

  // On a phone the sidebar is an overlay, so dismiss it after acting on a note.
  const closeOnMobile = () => {
    if (!isDesktop) setIsSidebar(false);
  };

  const asideClass = isDesktop
    ? `flex-none overflow-hidden border-r border-line bg-surface transition-[width] duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${
        isSidebar ? "w-72" : "w-0"
      }`
    : `absolute inset-y-0 left-0 z-30 w-72 overflow-hidden border-r border-line bg-surface transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${
        isSidebar ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      }`;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-paper text-ink">
      <Header
        isDark={isDark}
        toggleTheme={toggleTheme}
        isSidebar={isSidebar}
        setIsSidebar={setIsSidebar}
      />
      <main className="relative flex min-h-0 flex-1">
        <aside className={asideClass}>
          <Sidebar onAfterSelect={closeOnMobile} />
        </aside>

        {!isDesktop && isSidebar && (
          <div
            onClick={() => setIsSidebar(false)}
            className="absolute inset-0 z-20 bg-black/30"
            aria-hidden="true"
          />
        )}

        <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-paper">
          <Editor />
        </section>
      </main>
    </div>
  );
}
