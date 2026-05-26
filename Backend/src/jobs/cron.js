import cron from "node-cron";
import { Doctor } from "../models/doctor.models.js";
import { Appointment } from "../models/appointment.models.js";
import { Slot } from "../models/slots.models.js";
import { generateSlotsForDoctor } from "../services/slotGenerationService.js";

// Schedule task to run at 00:00 (Midnight) every day
const setupCronJobs = () => {
  console.log("⏳ Initializing Cron Jobs...");

  // Syntax: minute hour day(month) month day(week)
  // "0 0 * * *" = Everyday at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("⏰ Running Daily Slot Generation Job...");

    try {
      const doctors = await Doctor.find({
        isVisible: true,
        isAcceptingNewPatients: true,
      });

      console.log(`Found ${doctors.length} active doctors.`);

      for (const doctor of doctors) {
        console.log(`Generating slots for Dr. ${doctor.doctor}...`);
        await generateSlotsForDoctor(doctor, 7);
      }

      console.log("✅ Daily Slot Generation Job Completed.");
    } catch (error) {
      console.error("❌ Cron Job Failed:", error);
    }
  });

  // Run every minute to clean up abandoned unpaid appointments (older than 15 mins)
  cron.schedule("* * * * *", async () => {
    try {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

      // Find all appointments that are pending payment and older than 15 mins
      const expiredAppointments = await Appointment.find({
        status: "PENDING",
        paymentStatus: "PENDING",
        createdAt: { $lte: fifteenMinutesAgo },
      });

      if (expiredAppointments.length > 0) {
        console.log(
          `🧹 Found ${expiredAppointments.length} abandoned unpaid appointments. Cleaning up...`
        );

        for (const appointment of expiredAppointments) {
          // Free the slot
          await Slot.findByIdAndUpdate(appointment.slotId, {
            status: "AVAILABLE",
            bookedBy: null,
          });

          // Cancel the appointment
          appointment.status = "CANCELLED";
          appointment.cancellationReason =
            "Auto-cancelled due to payment timeout (15 mins)";
          appointment.cancelledAt = new Date();
          await appointment.save();
        }

        console.log("✅ Cleanup of abandoned appointments completed.");
      }
    } catch (error) {
      console.error("❌ Cleanup Cron Job Failed:", error);
    }
  });

  // Self-ping to keep Render server awake (Runs every 10 minutes)
  cron.schedule("*/10 * * * *", async () => {
    const url = process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL;
    if (!url) {
      console.log(
        "ℹ️  No external SERVER_URL or RENDER_EXTERNAL_URL configured — skipping self-ping."
      );
      return;
    }

    try {
      console.log(`📡 Self-pinging healthcheck: ${url}/api/v1/healthcheck`);
      if (typeof fetch === "function") {
        const response = await fetch(`${url}/api/v1/healthcheck`);
        console.log(
          `✅ Self-ping successful (fetch) — Status: ${response.status}`
        );
      } else {
        const https = await import("https");
        const http = await import("http");
        const client = url.startsWith("https") ? https : http;

        client
          .get(`${url}/api/v1/healthcheck`, (res) => {
            console.log(
              `✅ Self-ping successful (http/s) — Status: ${res.statusCode}`
            );
          })
          .on("error", (err) => {
            console.error("❌ Self-ping request failed:", err.message);
          });
      }
    } catch (error) {
      console.error("❌ Self-ping failed:", error.message);
    }
  });

  console.log("✅ Cron Jobs Scheduled.");
};

export default setupCronJobs;
