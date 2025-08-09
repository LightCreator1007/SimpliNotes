import mongoose from "mongoose";
import { Schema } from "mongoose";

const notesSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    heading: {
      type: String,
      default: "",
      required: true,
    },
  },
  { timestamps: true }
);

const Notes = mongoose.model("Notes", notesSchema);

export default Notes;
