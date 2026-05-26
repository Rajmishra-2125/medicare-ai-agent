import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createOrder,
  verifyPayment,
} from "../controllers/payment.controllers.js";

const router = Router();

// Secure all payment routes
router.use(verifyJWT);

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

export default router;
