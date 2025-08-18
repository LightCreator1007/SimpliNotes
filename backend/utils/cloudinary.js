import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new Error(400, "No file path provided");
    }

    console.log("Uploading to Cloudinary:", localFilePath);
    console.log("Cloudinary config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✓ Set" : "✗ Missing",
      api_key: process.env.CLOUDINARY_API_KEY ? "✓ Set" : "✗ Missing",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "✓ Set" : "✗ Missing",
    });

    if (!fs.existsSync(localFilePath)) {
      throw new Error(`File not found: ${localFilePath}`);
    }

    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log("Cloudinary Update successfull");

    fs.unlinkSync(localFilePath);
    return res;
  } catch (error) {
    console.error("Cloudinary upload failed: ", error);
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (err) {
      throw new Error("Error cleaning up file:", err);
    }
  }
};

export default uploadOnCloudinary;
