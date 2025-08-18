// backend/api/index.js
import "./config.js"; // Load env variables
import connectDb from "../db/dbConnect.js";
import app from "../app.js";
import serverless from "serverless-http";

// Ensure DB is connected before handling requests
let dbReady = false;

const ensureDbConnection = async () => {
  if (!dbReady) {
    await connectDb();
    dbReady = true;
  }
};

export default async function handler(req, res) {
  await ensureDbConnection();
  return serverless(app)(req, res);
}
