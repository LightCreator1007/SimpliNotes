# SimpliNotes

A clean, distraction free markdown notebook. One page in front of you, every keystroke saved on its own, in light or dark.

Built on the MERN stack (MongoDB, Express, React, Node).

## Features

**Writing**
- Markdown editing that reads as you type (headings, lists, quotes, code, checklists, links)
- Quick formatting bubble menu for bold, italic, strikethrough, inline code, and links
- Autosave on every keystroke, no save button to find
- Live word and character count with a saving indicator

**Notes**
- Create, rename, and delete notes
- Instant search across titles and content
- Notes sorted by most recently updated
- Each account sees only its own notes

**Account**
- Sign up and log in
- Profile photo upload (stored on Cloudinary)
- Update username and email
- Change password
- Sign out

**Sessions**
- JWT access and refresh tokens kept in httpOnly cookies
- Stays logged in across browser restarts
- Silent session renewal in the background

**Experience**
- Light and dark themes
- Responsive layout with a slide in sidebar on mobile

## Tech stack

**Frontend**
- React 19 with Vite
- React Router
- Zustand for state
- Tailwind CSS v4
- Tiptap editor with markdown
- lucide-react icons

**Backend**
- Node and Express 5
- MongoDB with Mongoose
- JWT and bcryptjs for auth
- Multer and Cloudinary for avatar uploads
- cookie-parser and CORS

## Getting started

You will need Node, a MongoDB connection string, and a Cloudinary account (only if you want avatar uploads).

**Backend**
```bash
cd backend
npm install
cp .env.sample .env   # then fill in the values
npm run dev           # starts on port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev           # Vite dev server, proxies /api to port 8000
```

Open the address Vite prints and you are ready to write.

## Environment variables

Set these in `backend/.env` (see `backend/.env.sample`):

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `PORT` | Backend port (defaults to 8000) |
| `ACCESS_TOKEN_SECRET` | Secret for short lived access tokens |
| `REFRESH_TOKEN_SECRET` | Secret for refresh tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLIENT_URL` | Allowed frontend origin(s) for CORS, comma separated |

## Project structure

```
backend/    Express API, MongoDB models, auth, notes
frontend/   React app, editor, pages, state
```
