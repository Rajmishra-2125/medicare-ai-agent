import multer from "multer";
import os from "os";
import path from "path";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      // Use OS temp directory - works on local, Render, Vercel, and all cloud platforms
      cb(null, os.tmpdir());
    },
    filename: function (req, file, cb) {
      // Add timestamp to prevent filename collisions when multiple users upload simultaneously
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    }
})

export const upload = multer({
  storage,
}); 