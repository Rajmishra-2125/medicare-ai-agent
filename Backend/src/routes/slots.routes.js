import { Router } from "express";
import {
  createManualSlot,
  generateAutoSlots,
  deleteSlot,
} from "../controllers/slots.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Secure all routes
router.use(verifyJWT);

// Generate auto slots
router.route("/generate").post(generateAutoSlots);

// Create manual slot
router.route("/create").post(createManualSlot);

// Delete slot
router.route("/delete").delete(deleteSlot);

export default router;
