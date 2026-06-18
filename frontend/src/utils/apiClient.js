// All requests go to `/api/...` (relative). In development Vite proxies /api to
// the local backend (see vite.config.js); in production Vercel rewrites /api to
// the deployed backend (see vercel.json). Keeping requests same-origin means the
// auth cookies are first-party and "just work".

async function apiFetch(path, options = {}, retry = true) {
  const opts = {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
    },
  };

  // Only set JSON content-type for plain bodies (let the browser set it for FormData).
  if (
    opts.body &&
    !(opts.body instanceof FormData) &&
    !(opts.body instanceof URLSearchParams) &&
    !opts.headers["Content-Type"]
  ) {
    opts.headers["Content-Type"] = "application/json";
  }

  const url = `/api${path.startsWith("/") ? path : `/${path}`}`;
  let res = await fetch(url, opts);

  // On 401, try to renew the session once, then replay the original request.
  if (res.status === 401 && retry) {
    const renewRes = await fetch("/api/user/renew", {
      method: "POST",
      credentials: "include",
    });

    if (renewRes.ok) {
      res = await fetch(url, opts);
    } else {
      throw new Error("Session expired. Please log in again.");
    }
  }

  return res;
}

export default apiFetch;
