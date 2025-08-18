import express from "express";
import userRouter from "./routes/user.route.js";
import notesRouter from "./routes/notes.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://simpli-notes-2.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

console.log(process.env.CLIENT_URL);

app.use(express.static("./uploads"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//routes
app.use("api/user", userRouter);
app.use("api/notes", notesRouter);

export default app;
