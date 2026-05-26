import { Router } from "express";
import {
  getAvailableSlots,
  applyForBooking,
  cancelBooking,
  myAppointments,
  getDoctorAppointments,
  getAppointmentDetailsBySlotId,
  updateAppointmentStatus,
  rescheduleAppointment,
} from "../controllers/appointment.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Get my appointments
router.route("/").get(verifyJWT, myAppointments);

// Get doctor appointments
router.route("/doctor-appointments").get(verifyJWT, getDoctorAppointments);

// Get/Update specific appointment
// Get Appointment details by Slot ID (New Route)
router.route("/slot/:slotId").get(verifyJWT, getAppointmentDetailsBySlotId);

// Update specific appointment (By Appointment ID)
router.route("/:appointmentId").patch(verifyJWT, updateAppointmentStatus);

// Reschedule
router
  .route("/:appointmentId/reschedule")
  .patch(verifyJWT, rescheduleAppointment);

// Checking availability by doctor username
router.route("/checkslot").post(verifyJWT, getAvailableSlots);

// Booking appointment
router.route("/bookslot").post(verifyJWT, applyForBooking);

// Cancelling appointment
router.route("/cancelslot").post(verifyJWT, cancelBooking);

export default router;
