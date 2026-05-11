import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Slot } from "../models/slots.models.js";
import { Doctor } from "../models/doctor.models.js";
import mongoose, { set } from "mongoose";
// Imports removed

import { generateSlotNumber } from "../utils/idGenerators.js";
import { generateSlotsForDoctor } from "../services/slotGenerationService.js";

// Generate auto slots for next 7 days
const generateAutoSlots = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const doctor = await Doctor.findOne({ doctorId: userId }).setOptions({
    includeInactive: true,
  });

  if (!doctor) {
    throw new ApiError(404, "Only doctor can generate slots");
  }

  const generatedSlotsCount = await generateSlotsForDoctor(doctor, 7);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { generatedSlots: generatedSlotsCount },
        `Successfully generated ${generatedSlotsCount} slots for the next 7 days`
      )
    );
});

const createManualSlot = asyncHandler(async (req, res) => {
  const username = req.user?.username;

  const { date, startTime, endTime, slotduration } = req.body;
  let slotNumber = req.body.slotNumber;

  if (!date || !startTime || !endTime || !slotduration) {
    throw new ApiError(
      400,
      "Date, startTime, endTime, slotduration are required."
    );
  }

  let validDate;
  try {
    if (typeof date === "string") {
      const [y, m, d] = date.split("T")[0].split("-");
      validDate = new Date(Date.UTC(parseInt(y), parseInt(m) - 1, parseInt(d)));
    } else {
      const d = new Date(date);
      validDate = new Date(
        Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
      );
    }
  } catch (e) {
    throw new ApiError(404, "Invalid date format. Enter: YYYY-MM-DD");
  }

  if (isNaN(validDate.getTime())) {
    throw new ApiError(404, "Invalid date format. Enter: YYYY-MM-DD");
  }

  const userId = req.user?._id;
  console.log(`[DEBUG] createManualSlot: UserID=${userId}`);
  const doctor = await Doctor.findOne({ doctorId: userId }).setOptions({
    includeInactive: true,
  });
  console.log(`[DEBUG] createManualSlot: Found Doctor Profile? ${!!doctor}`);

  if (!doctor) {
    throw new ApiError(404, "Only doctor can create slots");
  }

  const doctorId = doctor._id; // Corrected: Use Doctor Profile ID directly

  if (!slotNumber) {
    slotNumber = await generateSlotNumber(doctorId);
  }

  const checkSlot = await Slot.findOne({
    slotNumber: slotNumber,
    doctorId: doctorId,
    date: validDate,
    startTime: startTime,
    status: "AVAILABLE",
  });

  if (checkSlot) {
    throw new ApiError(404, "Slot already created");
  }

  const slots = await Slot.create({
    doctor: username, // Username
    doctorId: doctorId, // Profile ID
    slotNumber: slotNumber,
    date: validDate,
    startTime: startTime,
    endTime: endTime,
    slotduration: slotduration,
    status: "AVAILABLE",
  });

  return res
    .status(201)
    .json(new ApiResponse(200, { data: slots }, "Slots created successfully"));
});

const deleteSlot = asyncHandler(async (req, res) => {
  const userId = req.user?._id; // Logged in User ID
  const { slotNumber, date } = req.body;

  if (!slotNumber || !date) {
    throw new ApiError(400, "All fields are required.");
  }

  let validDate;
  try {
    if (typeof date === "string") {
      const [y, m, d] = date.split("T")[0].split("-");
      validDate = new Date(Date.UTC(parseInt(y), parseInt(m) - 1, parseInt(d)));
    } else {
      const d = new Date(date);
      validDate = new Date(
        Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
      );
    }
  } catch (e) {
    throw new ApiError(404, "Invalid date format. Enter: YYYY-MM-DD");
  }

  if (isNaN(validDate.getTime())) {
    throw new ApiError(404, "Invalid date format. Enter: YYYY-MM-DD");
  }

  // Find Doctor Profile via User ID
  const doctor = await Doctor.findOne({ doctorId: userId }).setOptions({
    includeInactive: true,
  });

  if (!doctor) {
    throw new ApiError(404, "Only doctor can delete slots");
  }

  const doctorId = doctor._id; // Profile ID

  const slot = await Slot.findOneAndDelete({
    slotNumber: slotNumber,
    doctorId: doctorId,
    date: validDate,
    status: "AVAILABLE",
  });

  console.log("date", validDate);

  console.log("slot", slot);

  if (!slot) {
    throw new ApiError(404, "No slot found");
  }

  return res.status(200).json(new ApiResponse(200, "Slot deleted"));
});

export { createManualSlot, generateAutoSlots, deleteSlot };
