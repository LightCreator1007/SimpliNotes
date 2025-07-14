const mongoose = require("mongoose");
const { Schema } = mongoose;

const notesSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attachments: [
      {
        type: Schema.Types.ObjectId,
        ref: "File",
      },
    ],
    content: {
      type: String,
      default: "",
    },
    heading: {
      type: String,
      default: "",
      required: true,
    },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const Notes = mongoose.model("Notes", notesSchema);

module.exports = { Notes };
