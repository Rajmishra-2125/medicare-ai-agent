import { Counter } from "../models/counter.models.js";

// Hospital code from .env or fallback
const HOSPITAL_CODE = process.env.HOSPITAL_CODE || "0001";

/**
 * Generates a Doctor ID in format: DOC-0001001
 * DOC- (Prefix) + 0001 (Hospital Code) + 001 (Sequential Number)
 */
export const generateDoctorId = async () => {
  const counterKey = `doctor_${HOSPITAL_CODE}`;
  const counter = await Counter.findByIdAndUpdate(
    counterKey,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const sequence = String(counter.seq).padStart(3, "0");
  return `DOC-${HOSPITAL_CODE}${sequence}`;
};

// Generating New Patient ID

export const generatePatientId = async () => {
  const now = new Date();

  const year = now.getFullYear();

  // Atomic increment — safe against race conditions
  const counterKey = `${year}_${HOSPITAL_CODE}`;
  const counter = await Counter.findByIdAndUpdate(
    counterKey,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  // Zero-pad sequence to 7 digits: 1 → "0000001"
  const sequence = String(counter.seq).padStart(7, "0");

  return `${year}${HOSPITAL_CODE}${sequence}`;
};

/**
 * Generates an Appointment ID in format: APT-2026-01-22-000001
 * APT- (Prefix) + YYYY-MM-DD (Date) + 000001 (Sequential Number)
 */
export const generateAppointmentId = async () => {
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD

  const counterKey = `appointment_${dateStr}`;
  const counter = await Counter.findByIdAndUpdate(
    counterKey,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const sequence = String(counter.seq).padStart(6, "0");
  return `APT-${dateStr}-${sequence}`;
};

/**
 * Generates a Slot Number in format: SLOT-0001-TodaysSlotNumber
 * SLOT- (Prefix) + 0001 (Hospital Code) + Sequential Number for the day
 */
export const generateSlotNumber = async (doctorId) => {
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];

  // Counter key unique to doctor and date to track daily slot numbers
  const counterKey = `slot_${doctorId}_${dateStr}`;
  const counter = await Counter.findByIdAndUpdate(
    counterKey,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `SLOT-${HOSPITAL_CODE}-${counter.seq}`;
};
