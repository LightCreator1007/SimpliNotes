import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
const router = Router();

router.post("/register", upload.single("avatar"), registerUser);

export default router;
