// backend/api/index.js
// Vercel serverless entrypoint. An Express app is itself a (req, res) handler,
// so we connect to the DB (once per warm instance) and delegate to it.
import "../config.js";
import connectDb from "../db/dbConnect.js";
import app from "../app.js";

let dbPromise = null;

const ensureDbConnection = () => {
  if (!dbPromise) {
    dbPromise = connectDb().catch((err) => {
      // reset so the next invocation can retry instead of caching a rejection
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
};

export default async function handler(req, res) {
  try {
    await ensureDbConnection();
  } catch (err) {
    console.error("Database connection failed:", err);
    return res.status(503).json({
      statusCode: 503,
      success: false,
      message: "Service unavailable: database connection failed",
      data: null,
    });
  }
  return app(req, res);
}
