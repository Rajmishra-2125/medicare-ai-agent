import Razorpay from "razorpay";
import crypto from "crypto";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Appointment } from "../models/appointment.models.js";
import { Doctor } from "../models/doctor.models.js";
import { User } from "../models/user.models.js";
import { sendEmail } from "../utils/sendEmail.js";

// Initialize razorpay instance
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(
      500,
      "Razorpay API keys are not configured in environment variables"
    );
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// Create a new Razorpay Order
export const createOrder = asyncHandler(async (req, res) => {
  const { appointmentId } = req.body;

  if (!appointmentId) {
    throw new ApiError(
      400,
      "appointmentId is required to generate payment order"
    );
  }

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  if (appointment.paymentStatus === "PAID") {
    throw new ApiError(400, "Appointment consultation fee is already paid");
  }

  const razorpay = getRazorpayInstance();

  // Razorpay amount is in paise (1 INR = 100 paise)
  // Add fallback if consultationFee is 0 or NaN
  const feeInPaisa = appointment.consultationFee
    ? Math.round(appointment.consultationFee * 100)
    : 0;

  if (feeInPaisa <= 0) {
    throw new ApiError(
      400,
      "Consultation fee is not valid for payment processing"
    );
  }

  const options = {
    amount: feeInPaisa,
    currency: "INR",
    receipt: `receipt_apptim_${appointment._id}`,
  };

  try {
    const order = await razorpay.orders.create(options);

    return res
      .status(200)
      .json(new ApiResponse(200, order, "Payment order created successfully"));
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    throw new ApiError(500, "Failed to create payment order with Razorpay");
  }
});

// Verify signature and mark Paid
export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    appointmentId,
  } = req.body;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !appointmentId
  ) {
    throw new ApiError(400, "Missing required payment breakdown details");
  }

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  // Verify Signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    // Handle failed payment case here if needed.
    appointment.paymentStatus = "FAILED";
    await appointment.save();
    throw new ApiError(400, "Payment verification failed. Invalid signature.");
  }

  // Payment is successful
  appointment.paymentStatus = "PAID";
  appointment.paymentMethod = "RAZORPAY";
  appointment.status = "CONFIRMED"; // Now we officially confirm it
  appointment.paidAt = new Date();
  appointment.razorpayOrderId = razorpay_order_id;
  appointment.razorpayPaymentId = razorpay_payment_id;

  await appointment.save();

  // Now dispatch emails and stats since we officially lock in the confirmed paid status
  const doctor = await Doctor.findById(appointment.doctorId);
  if (doctor) {
    // Update stats
    doctor
      .updateDoctorStats()
      .catch((err) => console.error("Stats Update Error:", err));

    try {
      const patientUser = await User.findById(appointment.patientId);
      const doctorUser = await User.findById(doctor.doctorId);

      // Dispatch Patient Email
      if (patientUser) {
        await sendEmail({
          email: patientUser.email,
          subject: "Payment Received & Appointment Confirmed - MediCare",
          message: `
                      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                        <h1 style="color: #2563eb; text-align: center;">Appointment Confirmed! 🎉</h1>
                        <p style="font-size: 16px; color: #333;">Hi <strong>${patientUser.fullname}</strong>,</p>
                        <p style="font-size: 16px; color: #333;">Your payment was successful and your appointment has been confirmed! Here are your official booking details:</p>
                        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                          <p style="margin: 5px 0;"><strong>Doctor:</strong> Dr. ${doctor.doctorDetails?.fullname || doctor.doctor}</p>
                          <p style="margin: 5px 0;"><strong>Date:</strong> ${appointment.date.toDateString()}</p>
                          <p style="margin: 5px 0;"><strong>Time:</strong> ${appointment.timeSlots}</p>
                          <p style="margin: 5px 0;"><strong>Consultation Fee:</strong> ₹${appointment.consultationFee} (PAID)</p>
                          <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
                        </div>
                        <p style="font-size: 14px; color: #64748b; text-align: center;">Thank you for choosing MediCare!</p>
                      </div>`,
        });
      }

      // Dispatch Doctor Email
      if (doctorUser) {
        await sendEmail({
          email: doctorUser.email,
          subject: "Action Required: New Paid Patient Booking - MediCare",
          message: `
                      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                        <h1 style="color: #16a34a; text-align: center;">New Patient Scheduled! 🩺</h1>
                        <p style="font-size: 16px; color: #333;">Dr. <strong>${doctor.doctorDetails?.fullname || doctor.doctor}</strong>,</p>
                        <p style="font-size: 16px; color: #333;">Great news! A new patient has successfully booked and <b>PAID</b> for one of your available time slots.</p>
                        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin: 20px 0;">
                          <p style="margin: 5px 0; color: #166534;"><strong>Patient Name:</strong> ${patientUser?.fullname || "Patient"}</p>
                          <p style="margin: 5px 0; color: #166534;"><strong>Date:</strong> ${appointment.date.toDateString()}</p>
                          <p style="margin: 5px 0; color: #166534;"><strong>Time Slot:</strong> ${appointment.timeSlots}</p>
                          <p style="margin: 5px 0; color: #166534;"><strong>Reason for Visit:</strong> ${appointment.reason}</p>
                        </div>
                      </div>`,
        });
      }
    } catch (emailError) {
      console.error("Email Dispatch Error After Payment:", emailError);
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, appointment, "Payment verified successfully"));
});
