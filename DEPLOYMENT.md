# Deploying SimpliNotes to Vercel

The app is two **separate Vercel projects** from this one repo:

| Project  | Root Directory | Framework Preset |
| -------- | -------------- | ---------------- |
| Backend  | `backend`      | Other            |
| Frontend | `frontend`     | Vite             |

The frontend calls the backend through a **same-origin proxy** (`frontend/vercel.json`
rewrites `/api/*` to the backend). This keeps the auth cookies first-party so login
works reliably across browsers.

---

## 1. Deploy the backend

1. New Vercel project → import this repo → set **Root Directory** to `backend`.
2. Add Environment Variables (Production):
   - `MONGODB_URI` – your MongoDB Atlas connection string
   - `ACCESS_TOKEN_SECRET` – random secret
   - `REFRESH_TOKEN_SECRET` – random secret
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `CLIENT_URL` – the frontend's URL, e.g. `https://simpli-notes-2.vercel.app`
     (comma-separate to allow several origins)
   - `NODE_ENV` is set to `production` by Vercel automatically — this switches the
     auth cookies to `secure` + `SameSite=None`.
3. Deploy. Note the resulting URL, e.g. `https://simplinotes-backend.vercel.app`.
   Sanity check: `GET <backend-url>/api/health` should return `{"status":"ok"}`.

Requests are routed by `backend/vercel.json` (`/api/*` → the Express serverless
function in `backend/api/index.js`).

## 2. Point the frontend at the backend

Edit **`frontend/vercel.json`** and set the proxy destination to your backend URL:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://YOUR-BACKEND.vercel.app/api/$1" },
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

(If you keep the backend on Railway instead, point it there — the app code works either way.)

## 3. Deploy the frontend

1. New Vercel project → same repo → set **Root Directory** to `frontend`.
2. No environment variables are required (all API calls are relative and proxied).
3. Deploy.

---

## Local development

```bash
# terminal 1 – backend (reads backend/.env, see backend/.env.sample)
cd backend && npm install && npm run dev      # http://localhost:8000

# terminal 2 – frontend
cd frontend && npm install && npm run dev      # http://localhost:5173
```

Vite proxies `/api` to `http://localhost:8000` (see `frontend/vite.config.js`), so the
same relative API paths work in dev and prod. In dev, `NODE_ENV` is unset, so cookies use
`SameSite=Lax` and are not `secure` (works over http).
