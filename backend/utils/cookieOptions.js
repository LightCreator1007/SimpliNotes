// Cookie options shared across auth responses.
// In production (Vercel) the frontend and backend may be served from different
// domains, so cookies must be `secure` + `sameSite: "none"` to be stored/sent.
// In local development over http we relax these so login still works.

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
};

export default cookieOptions;
