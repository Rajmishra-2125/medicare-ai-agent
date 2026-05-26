import { Router } from "express";
import {
  getDashboardStats,
  getAllUsers,
  getAllDoctors,
  getAllAppointments,
  approveDoctorRegistration,
  rejectDoctorRegistration,
  deletePatient,
  deleteDoctor,
  adminCreateSlot,
  adminBookAppointment,
  adminRescheduleAppointment,
  getAllSlots,
  adminCreateDoctor,
  updateUserAccountStatus,
} from "../controllers/admin.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

router.route("/dashboard-stats").get(verifyJWT, isAdmin, getDashboardStats);
router.route("/users").get(verifyJWT, isAdmin, getAllUsers);
router.route("/doctors").get(verifyJWT, isAdmin, getAllDoctors);
router.route("/appointments").get(verifyJWT, isAdmin, getAllAppointments);
router.route("/slots").get(verifyJWT, isAdmin, getAllSlots);
router.route("/create-slot").post(verifyJWT, isAdmin, adminCreateSlot);
router
  .route("/book-appointment")
  .post(verifyJWT, isAdmin, adminBookAppointment);
router
  .route("/reschedule-appointment/:appointmentId")
  .patch(verifyJWT, isAdmin, adminRescheduleAppointment);
router.route("/create-doctor").post(verifyJWT, isAdmin, adminCreateDoctor);
router
  .route("/approve-doctor/:doctorId")
  .patch(verifyJWT, isAdmin, approveDoctorRegistration);
router
  .route("/reject-doctor/:doctorId")
  .patch(verifyJWT, isAdmin, rejectDoctorRegistration);
router
  .route("/delete-patient/:userId")
  .delete(verifyJWT, isAdmin, deletePatient);
router
  .route("/delete-doctor/:doctorId")
  .delete(verifyJWT, isAdmin, deleteDoctor);
router
  .route("/update-user-status/:userId")
  .patch(verifyJWT, isAdmin, updateUserAccountStatus);

export default router;
