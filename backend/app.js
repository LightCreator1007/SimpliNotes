import express from "express";
import userRouter from "./routes/user.route.js";
import notesRouter from "./routes/notes.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import ApiError from "./utils/ApiError.js";

const app = express();

const allowedOrigins = (
  process.env.CLIENT_URL || "https://simpli-notes-2.vercel.app"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow same-origin / server-to-server (e.g. Vercel proxy) requests with no Origin
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

//routes
app.use("/api/user", userRouter);
app.use("/api/notes", notesRouter);

//unmatched routes -> JSON 404
app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

//central error handler: serialize ApiError (and unknown errors) to JSON
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  if (statusCode >= 500) {
    console.error("Unhandled error:", err);
  }
  res.status(statusCode).json({
    statusCode,
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
  });
});

export default app;
