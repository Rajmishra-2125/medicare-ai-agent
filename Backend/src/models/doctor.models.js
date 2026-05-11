import mongoose, { Schema } from "mongoose";

const doctorSchema = new Schema(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    customId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    doctor: {
      type: String,
      unique: true,
      sparse: true,
    },
    specialization: {
      type: String,
      index: true,
      trim: true,
    },
    qualification: {
      type: String,
    },
    experience: {
      type: String,
      min: [0, "Experience cannot be negative"],
      max: [70, "Experience seems too high"],
    },
    consultationFee: {
      type: String,
      min: [0, "Consultation fee cannot be negative"],
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      trim: true,
    },

    // Medical License Information
    licenseNumber: {
      type: String,
      unique: true,
      sparse: true, // sparse allow null/unique collision avoidance
      trim: true,
    },
    licenseIssuingAuthority: {
      type: String,
      trim: true,
    },
    licenseIssueDate: {
      type: Date,
    },
    licenseExpiryDate: {
      type: Date,
    },

    // Clinic/Hospital Information
    clinicName: {
      type: String,
      trim: true,
    },
    clinicAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    clinicPhone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    clinicEmail: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    // Availability Information
    availableDays: {
      type: [String], // ["MON", "TUE"]
      enum: [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ],
      default: [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ],
    },
    availableTimeSlots: {
      type: [String], // ["09:00-10:00", "10:00-11:00"]
      default: ["09:00 AM to 01:00 PM", "02:00 PM to 08:00 PM"],
    },
    workingHours: {
      start: {
        type: String, // "09:00"
        default: "09:00 AM",
      },
      end: {
        type: String, // "17:00"
        default: "08:00 PM",
      },
    },
    breakTime: {
      start: {
        type: String, // "12:00"
        default: "01:00 PM",
      },
      end: {
        type: String, // "13:00"
        default: "02:00 PM",
      },
    },
    slotDuration: {
      type: Number, // in minutes
      default: 30,
      min: 15,
      max: 120,
    },
    advanceBookingDays: {
      type: Number,
      default: 30,
      min: 1,
      max: 365,
    },

    // Status Information
    isVisible: {
      type: Boolean,
      default: false,
      index: true,
    },
    isAcceptingNewPatients: {
      type: Boolean,
      default: true,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    verifiedAt: {
      type: Date,
    },

    // Statistics
    totalAppointments: {
      type: Number,
      default: 0,
    },
    completedAppointments: {
      type: Number,
      default: 0,
    },
    canceledAppointments: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
doctorSchema.index({ specialization: 1, rating: -1 });
doctorSchema.index({ consultationFee: 1 });
doctorSchema.index({ isVisible: 1, isAcceptingNewPatients: 1 });

// Middleware to exclude invisible doctors from queries by default
doctorSchema.pre(/^find/, function () {
  if (!this.getOptions().includeInactive) {
    this.find({ isVisible: true });
  }
});

// Virtual for full clinic address
doctorSchema.virtual("fullClinicAddress").get(function () {
  if (!this.clinicAddress) return "Address not provided";

  const { street, city, state, zipCode, country } = this.clinicAddress;

  // Filter out undefined, null, or empty strings
  const addressParts = [street, city, state, zipCode, country].filter(Boolean);

  if (addressParts.length === 0) {
    return "Address not provided";
  }

  return addressParts.join(", ");
});

// Virtual for doctor avatar (retrieved from User model)
doctorSchema.virtual("doctorAvatar").get(function () {
  // Check if doctorId is populated and has profileImage
  if (this.doctorId && this.doctorId.profileImage) {
    return this.doctorId.profileImage;
  }
  return null;
});

// Instance method to check availability on a specific day
doctorSchema.methods.isAvailableOnDay = function (dayName) {
  return this.availableDays.includes(dayName.toUpperCase());
};

// Instance method to get working hours as a formatted string
doctorSchema.methods.hasTimeSlot = function (timeSlot) {
  return this.availableTimeSlots.includes(timeSlot);
};

// Instance method to update rating
doctorSchema.methods.updateRating = async function () {
  const Review = mongoose.model("Review");
  const reviews = await Review.find({ doctor: this.doctorId });

  if (reviews.length === 0) {
    this.rating = 0;
    this.reviewCount = 0;
  } else {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = (totalRating / reviews.length).toFixed(1);
    this.reviewCount = reviews.length;
  }

  await this.save();
};

// Instance method to update all doctor statistics (Rating + Appointment Counts)
doctorSchema.methods.updateDoctorStats = async function () {
  const Appointment = mongoose.model("Appointment");
  const Review = mongoose.model("Review");
  const doctorId = this._id;

  // 1. Calculate Appointment Stats
  const appointmentStats = await Appointment.aggregate([
    { $match: { doctorId: doctorId } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        cancelled: {
          $sum: { $cond: [{ $eq: ["$status", "CANCELLED"] }, 1, 0] },
        },
        completed: {
          $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] },
        },
      },
    },
  ]);

  const stats = appointmentStats[0] || { total: 0, cancelled: 0, completed: 0 };

  // 2. Calculate Review Stats
  const reviewStats = await Review.aggregate([
    { $match: { doctorId: doctorId, isApproved: true, isDeleted: false } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const rStats = reviewStats[0] || { averageRating: 0, count: 0 };

  // 3. Update Fields
  this.totalAppointments = stats.total;
  this.canceledAppointments = stats.cancelled; // naming convention in schema is canceled (one 'l')
  this.completedAppointments = stats.completed;
  this.rating = rStats.averageRating > 0 ? rStats.averageRating.toFixed(1) : 0;
  this.reviewCount = rStats.count;

  await this.save();
};

export const Doctor = mongoose.model("Doctor", doctorSchema);
