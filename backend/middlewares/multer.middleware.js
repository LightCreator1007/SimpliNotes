import multer from "multer";
import os from "os";

// Use the OS temp dir (writable on Vercel/serverless, where the project
// filesystem is read-only). Files are uploaded to Cloudinary then unlinked.
const tempDir = os.tmpdir();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

export default upload;
