import { useEffect } from "react";
import { PanelLeft, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store";
import Wordmark from "./Wordmark.jsx";

export default function Header({ isDark, toggleTheme, isSidebar, setIsSidebar }) {
  const { user, fetchUser } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const getInitials = (name = "") =>
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <header className="relative z-40 flex h-[57px] flex-none items-center justify-between border-b border-line bg-paper/90 px-4 backdrop-blur-md">
      <button
        onClick={() => setIsSidebar(!isSidebar)}
        aria-label={isSidebar ? "Hide notes" : "Show notes"}
        aria-pressed={isSidebar}
        className="grid h-9 w-9 place-items-center rounded-[9px] bg-accent-soft text-accent transition-colors hover:bg-accent/20"
      >
        <PanelLeft className="h-5 w-5" />
      </button>

      <Wordmark to="/" />

      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="grid h-9 w-9 place-items-center rounded-[9px] text-muted transition-colors hover:bg-accent-soft hover:text-ink"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button
          onClick={() => navigate("/account")}
          aria-label="Account"
          className="flex items-center gap-2.5 rounded-full p-0.5 transition-colors hover:bg-accent-soft"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.username || "You"}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-xs font-semibold text-paper">
              {getInitials(user?.username)}
            </span>
          )}
          <span className="hidden pr-1.5 text-sm font-medium text-ink min-[480px]:block">
            {user?.username || "Account"}
          </span>
        </button>
      </div>
    </header>
  );
}
