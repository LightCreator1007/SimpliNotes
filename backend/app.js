import express from "express";
import userRouter from "./routes/user.route.js";
import notesRouter from "./routes/notes.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

console.log(process.env.CLIENT_URL);

app.use(express.static("./uploads")); //all uploads will be treated as  static assets
app.use(express.urlencoded({ extended: false })); //parse from data and add it in request body
app.use(express.json()); //parse json and add it in request body

app.use(cookieParser());

//routes
app.use("/user", userRouter);
app.use("/notes", notesRouter);

export default app;
