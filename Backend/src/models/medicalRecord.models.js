import mongoose, { Schema } from "mongoose";

const medicalRecordSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String, // Cloudinary URL
      required: true,
    },
    fileType: {
      type: String, // PDF, IMG, ZIP
      required: true,
      trim: true,
    },
    fileSizeBytes: {
      type: Number,
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const MedicalRecord = mongoose.model(
  "MedicalRecord",
  medicalRecordSchema
);
