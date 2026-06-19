import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Moon, Sun } from "lucide-react";
import { useAppStore } from "../store";
import useDarkMode from "../utils/useDarkMode.js";
import Wordmark from "../components/Wordmark.jsx";

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAppStore((state) => state.setUser);
  const [isDark, toggleTheme] = useDarkMode();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in both fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const loggedInUser = data.data?.user;
        if (loggedInUser) {
          setUser(loggedInUser);
        }
        navigate("/home");
      } else {
        setError(data.message || "That email and password don't match");
      }
    } catch (err) {
      setError("Network error. Check your connection and try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-line bg-paper px-4 py-3 text-ink placeholder:text-faint transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft";

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="flex items-center justify-between px-6 py-5">
        <Wordmark to="/" size="sm" />
        <button
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-accent-soft hover:text-ink"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm rise">
          <div className="mb-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
              Welcome back
            </p>
            <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink">
              Pick up where you left off.
            </h1>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-7 shadow-[0_20px_50px_-30px_rgba(28,27,23,0.35)]">
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-lg border-l-2 border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-muted"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-muted"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${inputClass} pr-11`}
                    placeholder="Your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-faint transition-colors hover:text-ink"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-lg bg-ink py-3 font-medium text-paper transition-all hover:-translate-y-px hover:shadow-md disabled:translate-y-0 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            New here?{" "}
            <a
              href="/signup"
              className="font-medium text-accent underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
            >
              Make an account
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
