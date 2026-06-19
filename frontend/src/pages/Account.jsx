import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store";
import { Eye, EyeOff, X, Moon, Sun, ArrowLeft } from "lucide-react";
import useDarkMode from "../utils/useDarkMode.js";

const inputClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink placeholder:text-faint transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-soft";

function ChangePasswordOverlay({ isOpen, onClose, onSubmit }) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    setError("");
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      setError("New password must be different from the current one");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(passwordData);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      onClose();
    } catch (err) {
      setError(err.message || "Could not change password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
    setShowPasswords({ current: false, new: false, confirm: false });
    onClose();
  };

  if (!isOpen) return null;

  const fields = [
    { name: "currentPassword", label: "Current password", key: "current", placeholder: "Enter current password", hint: null },
    { name: "newPassword", label: "New password", key: "new", placeholder: "Enter new password", hint: "At least 8 characters" },
    { name: "confirmPassword", label: "Confirm new password", key: "confirm", placeholder: "Repeat new password", hint: null },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-xl font-semibold text-ink">
            Change password
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full text-faint transition-colors hover:bg-accent-soft hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          {error && (
            <div className="rounded-lg border-l-2 border-danger bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          {fields.map((field) => (
            <div key={field.name}>
              <label className="mb-2 block text-sm font-medium text-muted">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={showPasswords[field.key] ? "text" : "password"}
                  name={field.name}
                  value={passwordData[field.name]}
                  onChange={handlePasswordChange}
                  className={`${inputClass} pr-11`}
                  placeholder={field.placeholder}
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(field.key)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-faint transition-colors hover:text-ink"
                >
                  {showPasswords[field.key] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {field.hint && (
                <p className="mt-1 text-xs text-faint">{field.hint}</p>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 rounded-lg bg-ink py-2.5 font-medium text-paper transition-all hover:-translate-y-px hover:shadow-md disabled:translate-y-0 disabled:opacity-50"
            >
              {isLoading ? "Changing" : "Change password"}
            </button>
            <button
              onClick={handleClose}
              className="rounded-lg border border-line px-4 py-2.5 text-muted transition-colors hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Account() {
  const fileInputRef = useRef(null);
  const [isDark, toggleTheme] = useDarkMode();
  const navigate = useNavigate();

  const { user, updateUser, changeAvatar, fetchUser, changePassword, logout } =
    useAppStore();

  const handleSignOut = async () => {
    await logout();
    navigate("/");
  };
  const [avatar, setAvatar] = useState(user?.avatar);
  const [isEditingPic, setIsEditingPic] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isPasswordOverlayOpen, setIsPasswordOverlayOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ username: user.username || "", email: user.email || "" });
      setAvatar(user.avatar);
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  const getInitials = (name = "") =>
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
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
      setError(null);
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError(null);
  };

  const handleAvatarSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      let result;
      if (avatar instanceof File) {
        const formDataToSend = new FormData();
        formDataToSend.append("avatar", avatar);
        result = await changeAvatar(formDataToSend);
      } else if (avatar === null) {
        result = await changeAvatar(null);
      } else {
        setIsEditingPic(false);
        return;
      }

      if (result.success) {
        setSuccess("Profile photo updated");
        setIsEditingPic(false);
        await fetchUser();
      } else {
        setError(result.message || "Could not update photo");
      }
    } catch (err) {
      setError(err.message || "Could not update photo");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelAvatarEdit = () => {
    setAvatar(user?.avatar);
    setAvatarPreview(user?.avatar);
    setIsEditingPic(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUserDetailsSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!formData.username.trim() || !formData.email.trim()) {
      setError("Username and email are required");
      setIsLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const result = await updateUser(formData);
      if (result.success) {
        setSuccess("Profile updated");
        setIsEditingUser(false);
        await fetchUser();
      } else {
        setError(result.message || "Could not update profile");
      }
    } catch (err) {
      setError(err.message || "Could not update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelUserEdit = () => {
    setFormData({ username: user?.username || "", email: user?.email || "" });
    setIsEditingUser(false);
    setError(null);
    setSuccess(null);
  };

  const secondaryBtn =
    "rounded-lg border border-line bg-paper px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent";
  const primaryBtn =
    "rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper transition-all hover:-translate-y-px hover:shadow-md disabled:translate-y-0 disabled:opacity-50";
  const ghostBtn =
    "rounded-lg border border-line px-4 py-2 text-sm text-muted transition-colors hover:text-ink";

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="flex items-center justify-between border-b border-line px-6 py-3.5">
        <button
          onClick={() => navigate("/home")}
          aria-label="Back to notes"
          className="flex items-center gap-2.5 rounded-sm"
        >
          <ArrowLeft className="h-[18px] w-[18px] text-muted" />
          <span className="font-display text-[1.32rem] font-semibold tracking-tight text-ink">
            Simpli<span className="text-accent">Notes</span>
          </span>
        </button>
        <button
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-accent-soft hover:text-ink"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
            Account
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink">
            Account settings
          </h1>
          <p className="mt-2 text-muted">
            Manage your details and how you sign in.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border-l-2 border-danger bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-lg border-l-2 border-accent bg-accent-soft px-4 py-3 text-sm text-ink">
            {success}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          {/* Profile photo */}
          <section className="flex flex-col gap-6 p-7 sm:flex-row sm:items-start">
            <div className="shrink-0">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="h-24 w-24 rounded-full border border-line object-cover"
                />
              ) : (
                <div className="grid h-24 w-24 place-items-center rounded-full bg-ink text-2xl font-medium text-paper">
                  {getInitials(user?.username)}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-display text-lg font-semibold text-ink">
                Profile photo
              </h3>

              {!isEditingPic ? (
                <>
                  <p className="mb-3 mt-1 text-sm text-muted">
                    A photo helps your notebook feel like yours.
                  </p>
                  <button
                    onClick={() => setIsEditingPic(true)}
                    className={secondaryBtn}
                  >
                    Change photo
                  </button>
                </>
              ) : (
                <div className="mt-1 space-y-4">
                  <p className="text-sm text-muted">
                    Choose a new photo, up to 5MB.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <label className="cursor-pointer rounded-lg border border-line bg-paper px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent">
                      Choose file
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                    {avatarPreview && (
                      <button
                        onClick={removeAvatar}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleAvatarSave}
                      disabled={isLoading}
                      className={primaryBtn}
                    >
                      {isLoading ? "Saving" : "Save photo"}
                    </button>
                    <button onClick={cancelAvatarEdit} className={ghostBtn}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Personal information */}
          <section className="border-t border-line p-7">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ink">
                Personal information
              </h3>
              {!isEditingUser && (
                <button
                  onClick={() => setIsEditingUser(true)}
                  className={secondaryBtn}
                >
                  Edit
                </button>
              )}
            </div>

            {!isEditingUser ? (
              <div className="grid grid-cols-1 gap-5 min-[560px]:grid-cols-2">
                <div>
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                    Username
                  </p>
                  <p className="text-ink">{user?.username || "Not set"}</p>
                </div>
                <div>
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                    Email
                  </p>
                  <p className="text-ink">{user?.email || "Not set"}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 min-[560px]:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-muted">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Your username"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-muted">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleUserDetailsSave}
                    disabled={isLoading}
                    className={primaryBtn}
                  >
                    {isLoading ? "Saving" : "Save changes"}
                  </button>
                  <button onClick={cancelUserEdit} className={ghostBtn}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Password */}
          <section className="border-t border-line p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">
                  Password
                </h3>
                <p className="mt-1 text-sm text-muted">
                  A strong password keeps your notes yours.
                </p>
              </div>
              <button
                onClick={() => setIsPasswordOverlayOpen(true)}
                className={secondaryBtn}
              >
                Change password
              </button>
            </div>
          </section>

          {/* Sign out */}
          <section className="flex flex-col gap-4 border-t border-line p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">
                Sign out
              </h3>
              <p className="mt-1 text-sm text-muted">
                End your session on this device.
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-lg border border-line bg-paper px-4 py-2 text-sm font-medium text-danger transition-colors hover:border-danger hover:bg-danger/10"
            >
              Sign out
            </button>
          </section>
        </div>
      </div>

      <ChangePasswordOverlay
        isOpen={isPasswordOverlayOpen}
        onClose={() => setIsPasswordOverlayOpen(false)}
        onSubmit={changePassword}
      />
    </div>
  );
}
