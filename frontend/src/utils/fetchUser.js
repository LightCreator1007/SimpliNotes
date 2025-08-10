import apiFetch from "./apiClient";

export default async function fetchUser() {
  try {
    const user = await apiFetch("/user/me", { method: "GET" });
    return user;
  } catch (err) {
    console.error("Failed to fetch user:", err);
    return null;
  }
}
