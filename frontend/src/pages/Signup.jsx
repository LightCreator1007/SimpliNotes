import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, X, Moon, Sun } from "lucide-react";
import useDarkMode from "../utils/useDarkMode.js";
import Wordmark from "../components/Wordmark.jsx";

export default function SignUp() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isDark, toggleTheme] = useDarkMode();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please choose an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be under 5MB");
        return;
      }
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Use at least 3 characters";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Enter a valid email";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Use at least 6 characters";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      if (avatar) formDataToSend.append("avatar", avatar);

      const response = await fetch(`/api/user/register`, {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError("");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.message || "Could not create the account. Try again.");
      }
    } catch (err) {
      setError("Network error. Check your connection and try again.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (name) =>
    `w-full rounded-lg border bg-paper px-4 py-3 text-ink placeholder:text-faint transition-colors focus:outline-none focus:ring-2 focus:ring-accent-soft ${
      fieldErrors[name]
        ? "border-danger focus:border-danger"
        : "border-line focus:border-accent"
    }`;

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
              New notebook
            </p>
            <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink">
              Make an account.
            </h1>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-7 shadow-[0_20px_50px_-30px_rgba(28,27,23,0.35)]">
            {success && (
              <div
                role="status"
                className="mb-5 rounded-lg border-l-2 border-accent bg-accent-soft px-4 py-3 text-sm text-ink"
              >
                Account created. Taking you to sign in.
              </div>
            )}
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-lg border-l-2 border-danger bg-danger/10 px-4 py-3 text-sm text-danger"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Optional photo */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="grid h-20 w-20 place-items-center overflow-hidden rounded-full border border-line bg-paper text-[10px] font-mono uppercase tracking-[0.15em] text-faint transition-colors hover:border-accent hover:text-accent"
                  >
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      "Photo"
                    )}
                  </button>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={removeAvatar}
                      aria-label="Remove photo"
                      className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-ink text-paper shadow-sm transition-transform hover:scale-105"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <span className="mt-2 text-xs text-faint">Optional profile photo</span>
              </div>

              <div>
                <label htmlFor="username" className="mb-2 block text-sm font-medium text-muted">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={fieldClass("username")}
                  placeholder="Choose a username"
                />
                {fieldErrors.username && (
                  <p className="mt-1.5 text-xs text-danger">
                    {fieldErrors.username}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="signup-email" className="mb-2 block text-sm font-medium text-muted">
                  Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={fieldClass("email")}
                  placeholder="you@example.com"
                />
                {fieldErrors.email && (
                  <p className="mt-1.5 text-xs text-danger">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="signup-password" className="mb-2 block text-sm font-medium text-muted">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${fieldClass("password")} pr-11`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-faint transition-colors hover:text-ink"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1.5 text-xs text-danger">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-muted">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`${fieldClass("confirmPassword")} pr-11`}
                    placeholder="Type it again"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-faint transition-colors hover:text-ink"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-danger">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-lg bg-ink py-3 font-medium text-paper transition-all hover:-translate-y-px hover:shadow-md disabled:translate-y-0 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            Already have one?{" "}
            <a
              href="/login"
              className="font-medium text-accent underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
            >
              Sign in
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
