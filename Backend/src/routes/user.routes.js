import { Router } from "express";
import {
  getCurrentUser,
  updateAccountDetails,
  updateAddressDetails,
  updateUserAvatar,
  changeCurrentPassword,
  deleteAccount,
  recoverDeletedAccount,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// secured routes

// Get current user details
router.route("/current-user").get(verifyJWT, getCurrentUser);

// Update account details
router.route("/update-account-details").patch(verifyJWT, updateAccountDetails);
router.route("/update-account-address").patch(verifyJWT, updateAddressDetails);

// Update user avatar
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

// Change current password
router.route("/change-password").patch(verifyJWT, changeCurrentPassword);

// Delete user account
router.route("/delete-account").delete(verifyJWT, deleteAccount);

// Recover user account
router.route("/recover-account").post(recoverDeletedAccount);

export default router;
