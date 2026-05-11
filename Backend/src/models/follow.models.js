import mongoose, { Schema } from "mongoose";

const followSchema = new Schema(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent duplicate follows

followSchema.index(
  {
    doctorId: 1,
    patientId: 1,
  },
  {
    unique: true,
  }
);

// Only fetch non-deleted follows by default
followSchema.pre(/^find/, function () {
  if (!this.getOptions().includeDeleted) {
    this.find({ isDeleted: false });
  }
});

export const Follow = mongoose.model("Follow", followSchema);
