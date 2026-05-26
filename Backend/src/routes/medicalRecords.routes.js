import { Router } from "express";
import {
  uploadRecord,
  getRecords,
} from "../controllers/medicalRecords.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

// Secure all routes
router.use(verifyJWT);

// Get All records (Patient only sees theirs, Admins/Doctors see conditional)
router.route("/").get(getRecords);

// Upload a single record (Handles multipart form-data 'file')
router.route("/upload").post(upload.single("file"), uploadRecord);

export default router;
