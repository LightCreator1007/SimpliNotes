const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://simpli-notes-backend-production.up.railway.app/api";

async function apiFetch(url, options = {}, retry = true) {
  console.log(API_URL);

  const opts = {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
    },
  };

  if (
    opts.body &&
    !(opts.body instanceof FormData) &&
    !(opts.body instanceof URLSearchParams) &&
    !opts.headers?.["Content-Type"]
  ) {
    opts.headers = { ...opts.headers, "Content-Type": "application/json" };
  }

  let res = await fetch(`${API_URL}${url}`, opts);

  if (res.status === 401 && retry) {
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

  return res;
}

export default apiFetch;
