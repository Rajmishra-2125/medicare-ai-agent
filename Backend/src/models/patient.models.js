import mongoose, { Schema } from "mongoose";

const patientSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    bloodGroup: {
      type: String,
      index: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    alergies: {
      type: [String],
      default: [],
    },
    chronicDiseases: {
      type: [String],
      default: [],
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },

    // Medical History
    medicalHistory: [
      {
        condition: String,
        diagnosisDate: Date,
        status: {
          type: String,
          enum: ["ACTIVE", "CHRONIC", "RESOLVED"],
        },
        notes: String,
      },
    ],

    // Current Medications
    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        startDate: Date,
        endDate: Date,
      },
    ],

    // Statistics

    totalAppointments: {
      type: Number,
      default: 0,
    },
    completedAppointments: {
      type: Number,
      default: 0,
    },
    cancelledAppointments: {
      type: Number,
      default: 0,
    },
    followingDoctorsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", patientSchema);

export { Patient };
