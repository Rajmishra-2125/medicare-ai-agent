import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";


dotenv.config()

// configure cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload on Cloudinary
        const response = await cloudinary.uploader.upload(
            localFilePath,
            {
               resource_type: "auto",
            }
        );

        // File has uploaded successfully — clean up the local temp file
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error("Cloudinary upload failed:", error.message);
        // Clean up temp file even on failure
        try { fs.unlinkSync(localFilePath); } catch (_) {}
        return null;
    }
}

const deleteFromCloudinary =  async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Deleted from cloudinary. Public id", publicId);
      
    } catch (error) {
      console.log("Error deleting from cloudinary", error);
      return null;
    }
}

export { uploadOnCloudinary, deleteFromCloudinary};