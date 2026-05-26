import { Router } from "express";
import {
  getDoctors,
  getMyProfile,
  updateDoctorProfile,
  getDoctorsBySpecialization,
  getDoctorsByMostFollowers,
  getDoctorPatients,
  getDoctorPrescriptions,
  emailPrescriptionController,
} from "../controllers/doctor.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { cacheMiddleware } from "../middlewares/cache.middleware.js";

const router = Router();

/**
 * =========================
 * Protected Routes
 * =========================
 */

// Get explicit current doctor profile
router.route("/my-profile").get(verifyJWT, getMyProfile);

// Update doctor profile
router.route("/updateInfo").patch(verifyJWT, updateDoctorProfile);

// Geting normal doctors list
router
  .route("/profiles")
  .get(cacheMiddleware("doctors:profiles", 3600), getDoctors);

// Get doctors availability by Specilization
router
  .route("/:specialization")
  .post(
    verifyJWT,
    cacheMiddleware("doctors:specialization", 3600),
    getDoctorsBySpecialization
  );

// Get doctors availability by Specilization and followers
router
  .route("/:specialization/mostfollowers")
  .post(
    verifyJWT,
    cacheMiddleware("doctors:followers", 3600),
    getDoctorsByMostFollowers
  );

// Get doctor's patients
router.route("/patients").get(verifyJWT, getDoctorPatients);

// Get doctor's prescriptions
router.route("/prescriptions").get(verifyJWT, getDoctorPrescriptions);

// Email prescription
router
  .route("/send-prescription/:appointmentId")
  .post(verifyJWT, emailPrescriptionController);

export default router;
