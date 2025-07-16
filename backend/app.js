import express from "express";
import userRouter from "./routes/user.route.js";
const app = express();

app.use(express.static("./uploads")); //all uploads will be treated as  static assets
app.use(express.urlencoded({ extended: false })); //parse from data and add it in request body
app.use(express.json()); //parse json and add it in request body

//routes
app.use("/user", userRouter);
