import Notes from "../models/notes.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// asyncHandler forwards any thrown/rejected error to the central error handler,
// so we don't wrap these in try/catch (which previously masked real status codes).

//create a new note
const createNote = asyncHandler(async (req, res) => {
  const { heading, content } = req.body;
  if (!heading) {
    throw new ApiError(400, "Heading is required");
  }
  const note = await Notes.create({
    createdBy: req.user._id,
    heading,
    content,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, note, "Note Created successfully"));
});

// get all notes for the user
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Notes.find({ createdBy: req.user._id }).sort({
    createdAt: -1,
  });
  return res.status(200).json(new ApiResponse(200, notes, "Notes fetched"));
});

//get a single note
const getNoteById = asyncHandler(async (req, res) => {
  const note = await Notes.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });
  if (!note) {
    throw new ApiError(404, "Note not found");
  }
  return res.status(200).json(new ApiResponse(200, note));
});

//update note
const updateNote = asyncHandler(async (req, res) => {
  const { heading, content } = req.body;
  // only update the fields actually provided (the editor autosaves content only)
  const updates = {};
  if (heading !== undefined) updates.heading = heading;
  if (content !== undefined) updates.content = content;

  const note = await Notes.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    updates,
    { new: true }
  );
  if (!note) {
    throw new ApiError(404, "Note not found");
  }
  return res.status(200).json(new ApiResponse(200, note, "Note Updated"));
});

// delete note
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Notes.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!note) throw new ApiError(404, "Note not found");

  return res.status(200).json(new ApiResponse(200, {}, "Note deleted"));
});

export { createNote, getAllNotes, getNoteById, updateNote, deleteNote };
