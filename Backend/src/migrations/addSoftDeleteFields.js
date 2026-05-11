import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { Doctor } from "../models/doctor.models.js";
import dotenv from "dotenv";

dotenv.config();

const migrate = async () => {
  try {
    console.log("Connecting... to database");

    mongoose.connect(process.env.MONGODB_URI);

    console.log("✅Connected to MongoDB");
    console.log("🔄Starting migration....");

    // Update all existing users to have isActive: true and accountStatus: "ACTIVE"
    console.log("📝Updating User model...");

    const userUpdateResult = await User.updateMany(
      { isActive: { $exists: false } },
      {
        $set: {
          isActive: true,
          accountStatus: "ACTIVE",
          deletionScheduledAt: null,
          deletionExecutionDate: null,
          deletionReason: null,
        },
      }
    );
    console.log(`✅ Updated ${userUpdateResult.modifiedCount} user records.`);

    // Update all existing doctors to have isVisible: true

    console.log("📝Updating Doctor model...");

    const doctorUpdateResult = await Doctor.updateMany(
      { isVisible: { $exists: false } },
      {
        $set: {
          isVisible: true,
          isAcceptingNewPatients: true,
        },
      }
    );
    console.log(
      `✅ Updated ${doctorUpdateResult.modifiedCount} doctor records.`
    );

    console.log("🎉 Migration completed successfully.");

    console.log("Summary:");
    console.log(`- Users updated: ${userUpdateResult.modifiedCount}`);
    console.log(`- Doctors updated: ${doctorUpdateResult.modifiedCount}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

migrate();
