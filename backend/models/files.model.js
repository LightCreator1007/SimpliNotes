const mongoose = require("mongoose");
const { Schema } = mongoose;

const fileSchema = new Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
    },
    size: {
      type: Number,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    noteId: {
      type: Schema.Types.ObjectId,
      ref: "Notes",
    },
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

module.exports = { File };
