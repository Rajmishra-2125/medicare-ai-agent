import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  googleAuthLogin,
  verifyEmailOTP,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controllers.js";

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new patient or doctor
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - fullname
 *               - phone
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               fullname:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [PATIENT, DOCTOR, ADMIN]
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully.
 *
 * /auth/login:
 *   post:
 *     summary: Login user and return credentials
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 *
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access and refresh tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully.
 */

// Register new user
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxcount: 1,
    },
  ]),
  registerUser
);

// Login user
router.route("/login").post(loginUser);

// Google OAuth Login
router.route("/google").post(googleAuthLogin);

// Verify OTP
router.route("/verify-otp").post(upload.none(), verifyEmailOTP);

// Refresh access token
router.route("/refresh-token").get(refreshAccessToken).post(refreshAccessToken);

// <=> Secured routes <=>

// Logout user
router.route("/logout").post(verifyJWT, logoutUser);

// Get new refresh token
router.route("/refresh-tokens").get(verifyJWT, refreshAccessToken);

// Password Reset
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

// Exporting all routes
export default router;
