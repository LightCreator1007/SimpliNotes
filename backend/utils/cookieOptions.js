// Cookie options shared across auth responses.
// In production (Vercel) the frontend and backend may be served from different
// domains, so cookies must be `secure` + `sameSite: "none"` to be stored/sent.
// In local development over http we relax these so login still works.

const isProd = process.env.NODE_ENV === "production";

// Base attributes shared by every auth cookie. Used as-is for clearCookie on
// logout (where maxAge is irrelevant).
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
};

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

// Without maxAge a cookie is a *session* cookie and the browser drops it when it
// closes, so the user appears logged out on next visit. Giving each cookie a
// maxAge that matches its JWT lifetime makes the session persist across closes.
export const accessTokenCookieOptions = {
  ...cookieOptions,
  maxAge: 15 * MINUTE, // matches access token expiry
};

export const refreshTokenCookieOptions = {
  ...cookieOptions,
  maxAge: 10 * DAY, // matches refresh token expiry
};

export default cookieOptions;
