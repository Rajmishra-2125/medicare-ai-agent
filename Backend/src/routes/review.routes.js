import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  addReview,
  getDoctorReviews,
  deleteReview,
} from "../controllers/review.controllers.js";

const router = Router();

// Public routes (if needed, but usually reading reviews is public)
router.route("/:doctorId").get(getDoctorReviews);

// Protected routes
router.use(verifyJWT);

// Add review
router.route("/add").post(addReview);

// Delete review
router.route("/:reviewId").delete(deleteReview);

export default router;
