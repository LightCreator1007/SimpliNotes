import { Router } from "express";
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/notes.controller.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwt);

router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
