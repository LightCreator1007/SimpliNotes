const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function apiFetch(url, options = {}) {
  const opts = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  let res = await fetch(`${API_URL}${url}`, opts);

  if (res.status === 401) {
    const renewRes = await fetch(`${API_URL}/user/renew`, {
      method: "POST",
      credentials: "include",
    });

    if (renewRes.ok) {
      res = await fetch(`${API_URL}${url}`, opts);
    } else {
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}

export default apiFetch;
