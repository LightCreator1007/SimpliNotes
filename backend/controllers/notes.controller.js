import Notes from "../models/notes.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

//creaate a new note
const createNote = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    throw new ApiError(500, `Failed to create note: ${error.message}`);
  }
});

// get all notes for the user

const getAllNotes = asyncHandler(async (req, res) => {
  try {
    const notes = await Notes.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(new ApiResponse(200, notes, "Notes fetched"));
  } catch (error) {
    throw new ApiError(500, `Failed to fetch notes: $(error.message)`);
  }
});

//get a single note

const getNoteById = asyncHandler(async (req, res) => {
  try {
    const note = await Notes.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!note) {
      throw new ApiError(404, "Note not found");
    }
    return res.status(200).json(new ApiResponse(200, note));
  } catch (error) {
    throw new ApiError(500, `Failed to fetch note: ${error.message}`);
  }
});

//update note
const updateNote = asyncHandler(async (req, res) => {
  try {
    const { heading, content } = req.body;
    const note = await Notes.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { heading, content },
      { new: true }
    );
    if (!note) {
      throw new ApiError(404, "Note not found");
    }
    return res.status(200).json(new ApiResponse(200, note, "Note Updated"));
  } catch (error) {
    throw new ApiError(400, "Error Updating notes");
  }
});

// delete note

const deleteNote = asyncHandler(async (req, res) => {
  try {
    const note = await Notes.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!note) throw new ApiError(404, "Note not found");

    return res.status(200).json(new ApiResponse(200, {}, "Note deleted"));
  } catch (error) {
    throw new ApiError(400, "Error deleting the note");
  }
});

export { createNote, getAllNotes, getNoteById, updateNote, deleteNote };
