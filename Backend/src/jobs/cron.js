import cron from "node-cron";
import { Doctor } from "../models/doctor.models.js";
import { generateSlotsForDoctor } from "../services/SlotGenerationService.js";

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

  console.log("✅ Cron Jobs Scheduled.");
};

export default setupCronJobs;